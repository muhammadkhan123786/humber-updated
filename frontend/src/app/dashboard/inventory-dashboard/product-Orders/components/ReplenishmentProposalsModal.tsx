"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ReplenishmentProposalsModal.tsx
//
// Professional modal with modern gradient header, fixed close button,
// and improved visual design.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
    DialogClose
} from "@/components/form/Dialog";
import { Button } from "@/components/form/CustomButton";
import { motion } from "framer-motion";
import {
    AlertTriangle, CheckSquare, Square, PackageX,
    TrendingDown, ShieldAlert, RefreshCw, Loader2,
    ArrowUpDown, ChevronUp, ChevronDown, Zap,
    Building2, Send, CheckCircle2, Info, X,
    ShoppingCart, Clock, DollarSign, Package, Search
} from "lucide-react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReorderProduct {
    productId: string;
    productName: string;
    sku: string;
    currentStock: number;
    reorderPoint: number;
    safetyStock: number;
    maxStockLevel: number;
    suggestedQty: number;
    costPrice: number;
    supplierId: string;
    supplierName: string;
    supplierEmail: string;
    daysUntilStockout?: number;
    severity: "critical" | "warning" | "low";
}

interface ReplenishmentProposalsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: ReorderProduct[];
    onCreateOrders: (selected: ReorderProduct[]) => Promise<void>;
    isCreating?: boolean;
}

// ─── Severity config with professional colors ─────────────────────────────────

const SEVERITY = {
    critical: {
        label: "Critical",
        icon: ShieldAlert,
        row: "bg-gradient-to-r from-red-50/80 to-rose-50/80",
        badge: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0",
        dot: "bg-red-500",
        lightBadge: "bg-red-100 text-red-700 border-red-200",
        text: "text-red-600",
        bg: "bg-red-50"
    },
    warning: {
        label: "Warning",
        icon: AlertTriangle,
        row: "bg-gradient-to-r from-orange-50/80 to-amber-50/80",
        badge: "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0",
        dot: "bg-orange-500",
        lightBadge: "bg-orange-100 text-orange-700 border-orange-200",
        text: "text-orange-600",
        bg: "bg-orange-50"
    },
    low: {
        label: "Low Stock",
        icon: TrendingDown,
        row: "bg-gradient-to-r from-amber-50/80 to-yellow-50/80",
        badge: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0",
        dot: "bg-amber-500",
        lightBadge: "bg-amber-100 text-amber-700 border-amber-200",
        text: "text-amber-600",
        bg: "bg-amber-50"
    },
} as const;

// ─── Stock bar with gradient ────────────────────────────────────────────────

function StockBar({ current, max, reorder, severity }: {
    current: number; max: number; reorder: number; severity: string;
}) {
    if (max <= 0) return null;
    const currentPct = Math.min((current / max) * 100, 100);
    const reorderPct = Math.min((reorder / max) * 100, 100);
    
    const gradientColor = 
        severity === "critical" ? "from-red-500 to-rose-500" :
        severity === "warning" ? "from-orange-500 to-amber-500" :
        "from-amber-500 to-yellow-500";

    return (
        <div className="relative h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${currentPct}%` }}
                className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${gradientColor}`}
            />
            {/* Reorder marker */}
            <div className="absolute top-0 h-full w-0.5 bg-gray-700 opacity-50" style={{ left: `${reorderPct}%` }} />
        </div>
    );
}

// ─── Sort component ────────────────────────────────────────────────────────

type SortKey = "productName" | "currentStock" | "suggestedQty" | "severity" | "supplierName";
type SortDir = "asc" | "desc";

const SEVERITY_ORDER = { critical: 0, warning: 1, low: 2 };

function Th({ label, sortable, sortKey, sortDir, onToggle }: {
    label: string;
    sortable?: SortKey;
    sortKey?: SortKey;
    sortDir?: SortDir;
    onToggle?: (k: SortKey) => void;
}) {
    const active = sortable && sortKey === sortable;
    
    return (
        <th
            className={`px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                sortable ? "cursor-pointer select-none hover:text-indigo-600 group" : "text-gray-500"
            }`}
            onClick={() => sortable && onToggle && onToggle(sortable)}
        >
            <div className="flex items-center gap-1.5">
                <span className={active ? "text-indigo-600" : "text-gray-500 group-hover:text-gray-700"}>
                    {label}
                </span>
                {sortable && (
                    <div className={`transition-colors ${active ? "text-indigo-600" : "text-gray-300 group-hover:text-gray-500"}`}>
                        {active ? (
                            sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ArrowUpDown className="h-3 w-3" />
                        )}
                    </div>
                )}
            </div>
        </th>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export function ReplenishmentProposalsModal({
    open,
    onOpenChange,
    products,
    onCreateOrders,
    isCreating = false,
}: ReplenishmentProposalsModalProps) {

    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [sortKey, setSortKey] = useState<SortKey>("severity");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [filterText, setFilterText] = useState("");

    // ── Filtered + sorted list ────────────────────────────────────────────
    const visible = useMemo(() => {
        let list = [...products];
        if (filterText.trim()) {
            const q = filterText.toLowerCase();
            list = list.filter(p =>
                p.productName.toLowerCase().includes(q) ||
                p.sku.toLowerCase().includes(q) ||
                p.supplierName.toLowerCase().includes(q)
            );
        }
        list.sort((a, b) => {
            let cmp = 0;
            if (sortKey === "severity") cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
            else if (sortKey === "currentStock") cmp = a.currentStock - b.currentStock;
            else if (sortKey === "suggestedQty") cmp = a.suggestedQty - b.suggestedQty;
            else cmp = a[sortKey].localeCompare(b[sortKey]);
            return sortDir === "asc" ? cmp : -cmp;
        });
        return list;
    }, [products, filterText, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
        else { setSortKey(key); setSortDir("asc"); }
    };

    // ── Selection ─────────────────────────────────────────────────────────
    const allSelected = visible.length > 0 && visible.every(p => selected.has(p.productId));
    const someSelected = visible.some(p => selected.has(p.productId));

    const toggleAll = () => {
        if (allSelected) {
            setSelected(prev => { const n = new Set(prev); visible.forEach(p => n.delete(p.productId)); return n; });
        } else {
            setSelected(prev => { const n = new Set(prev); visible.forEach(p => n.add(p.productId)); return n; });
        }
    };

    const toggleOne = (id: string) => {
        setSelected(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    // ── Summary stats ─────────────────────────────────────────────────────
    const selectedProducts = products.filter(p => selected.has(p.productId));
    const uniqueSuppliers = new Set(selectedProducts.map(p => p.supplierId)).size;
    const totalOrderValue = selectedProducts.reduce((s, p) => s + p.suggestedQty * p.costPrice, 0);
    const criticalCount = products.filter(p => p.severity === "critical").length;

    // ── Confirm ───────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        if (selected.size === 0) {
            toast.warning("Select at least one product to create a purchase order.");
            return;
        }
        await onCreateOrders(selectedProducts);
        setSelected(new Set());
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
                {/* Accessibility - visually hidden but available for screen readers */}
                <DialogTitle className="sr-only">Replenishment Proposals</DialogTitle>
                <DialogDescription className="sr-only">
                    {products.length} product{products.length !== 1 ? "s" : ""} require stock replenishment.
                    {criticalCount > 0 && ` ${criticalCount} critical item${criticalCount !== 1 ? "s" : ""}.`}
                </DialogDescription>

                {/* ✨ Professional Gradient Header with Close Button ✨ */}
                <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-8 py-6 shrink-0">
                    {/* Decorative elements */}
                    <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
                    
                    {/* Header Content */}
                    <div className="relative flex items-start justify-between">
                        <div className="space-y-2">
                            {/* Title with icon */}
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                    <RefreshCw className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        Replenishment Proposals
                                        {criticalCount > 0 && (
                                            <span className="px-2.5 py-1 bg-red-500/90 text-white text-xs font-bold rounded-full">
                                                {criticalCount} Critical
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-indigo-200 text-sm mt-1">
                                        {products.length} product{products.length !== 1 ? "s" : ""} need restocking • Grouped by supplier
                                    </p>
                                </div>
                            </div>

                            {/* Quick stats */}
                            <div className="flex items-center gap-6 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Package className="h-4 w-4 text-indigo-200" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-200">Total Products</p>
                                        <p className="text-lg font-bold text-white">{products.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <Building2 className="h-4 w-4 text-indigo-200" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-200">Suppliers</p>
                                        <p className="text-lg font-bold text-white">
                                            {new Set(products.map(p => p.supplierId)).size}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-indigo-200" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-200">Est. Total</p>
                                        <p className="text-lg font-bold text-white">
                                            £{products.reduce((s, p) => s + p.suggestedQty * p.costPrice, 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                     
                    </div>

                    {/* Search Bar */}
                    <div className="relative mt-6">
                        <input
                            type="text"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                            placeholder="Search by product, SKU or supplier..."
                            className="w-full h-12 pl-4 pr-10 rounded-xl border-0 bg-white/10 backdrop-blur-sm text-white placeholder-indigo-200/70 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-200/70" />
                    </div>
                </div>

                {/* Selection Stats Bar */}
                {selected.size > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 shrink-0"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Selected</p>
                                        <p className="text-lg font-bold text-indigo-700">{selected.size}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Building2 className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Suppliers</p>
                                        <p className="text-lg font-bold text-purple-700">{uniqueSuppliers}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Est. Value</p>
                                        <p className="text-lg font-bold text-emerald-700">£{totalOrderValue.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(new Set())}
                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                Clear Selection
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Table */}
                <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/50">
                    {visible.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <PackageX className="h-10 w-10 text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700">No products found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="sticky top-0 bg-white border-b-2 border-gray-200 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-4 w-10">
                                        <button onClick={toggleAll} className="text-gray-400 hover:text-indigo-600">
                                            {allSelected ? (
                                                <CheckSquare className="h-5 w-5 text-indigo-600" />
                                            ) : someSelected ? (
                                                <div className="h-5 w-5 rounded border-2 border-indigo-400 bg-indigo-100 flex items-center justify-center">
                                                    <div className="h-2 w-2 bg-indigo-600 rounded-sm" />
                                                </div>
                                            ) : (
                                                <Square className="h-5 w-5" />
                                            )}
                                        </button>
                                    </th>
                                    <Th label="Status" sortable="severity" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                                    <Th label="Product" sortable="productName" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                                    <Th label="Stock" sortable="currentStock" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                                    <Th label="Order Qty" sortable="suggestedQty" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                                    <Th label="Unit Cost" />
                                    <Th label="Line Total" />
                                    <Th label="Supplier" sortable="supplierName" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                                    <Th label="Days Left" />
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((product, idx) => {
                                    const sev = SEVERITY[product.severity];
                                    const SevIcon = sev.icon;
                                    const isChecked = selected.has(product.productId);
                                    const lineTotal = product.suggestedQty * product.costPrice;

                                    return (
                                        <motion.tr
                                            key={product.productId}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => toggleOne(product.productId)}
                                            className={`border-b border-gray-100 cursor-pointer transition-all ${
                                                isChecked 
                                                    ? "bg-gradient-to-r from-indigo-50/80 to-purple-50/80 hover:from-indigo-100/80 hover:to-purple-100/80" 
                                                    : "hover:bg-gray-50/80"
                                            }`}
                                        >
                                            <td className="px-4 py-4">
                                                {isChecked ? (
                                                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                                                ) : (
                                                    <Square className="h-5 w-5 text-gray-300" />
                                                )}
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${sev.lightBadge}`}>
                                                    <SevIcon className="h-3.5 w-3.5" />
                                                    {sev.label}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <p className="text-sm font-medium text-gray-900">{product.productName}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{product.sku}</p>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm font-bold ${sev.text}`}>
                                                            {product.currentStock}
                                                        </span>
                                                        <span className="text-xs text-gray-400">/ {product.maxStockLevel}</span>
                                                    </div>
                                                    <StockBar
                                                        current={product.currentStock}
                                                        max={product.maxStockLevel}
                                                        reorder={product.reorderPoint}
                                                        severity={product.severity}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-100">
                                                    {product.suggestedQty}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-600">
                                                £{product.costPrice.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className="font-medium text-gray-900">
                                                    £{lineTotal.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${product.supplierId ? "bg-green-500" : "bg-gray-300"}`} />
                                                    <span className="text-sm text-gray-700">{product.supplierName || "—"}</span>
                                                </div>
                                                {product.supplierEmail && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{product.supplierEmail}</p>
                                                )}
                                            </td>
                                            <td className="px-3 py-4">
                                                {product.daysUntilStockout != null ? (
                                                    <span className={`text-sm font-semibold ${
                                                        product.daysUntilStockout <= 3 ? "text-red-600" :
                                                        product.daysUntilStockout <= 7 ? "text-orange-600" :
                                                        "text-amber-600"
                                                    }`}>
                                                        {product.daysUntilStockout}d
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-400">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t-2 border-gray-200 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Info className="h-4 w-4 text-gray-400" />
                            <span>
                                Products are grouped by supplier — each supplier generates one PO with a unique number
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isCreating}
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={selected.size === 0 || isCreating}
                                className={`flex items-center gap-2 px-6 ${
                                    selected.size > 0
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {isCreating ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating {uniqueSuppliers} PO{uniqueSuppliers !== 1 ? "s" : ""}…</>
                                ) : (
                                    <><Send className="h-4 w-4" /> Create {uniqueSuppliers} Purchase Order{uniqueSuppliers !== 1 ? "s" : ""}</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}