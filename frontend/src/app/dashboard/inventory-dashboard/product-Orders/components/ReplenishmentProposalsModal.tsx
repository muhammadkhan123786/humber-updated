"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ReplenishmentProposalsModal.tsx
//
// Opens from the "View Replenishment Proposals" button inside PurchaseOrderForm.
// Shows every product at or below its reorder point in a professional table.
// Buyer can select all or individual rows → "Create Purchase Orders" submits
// one PO per unique supplier (grouped), saves to DB, and triggers supplier emails.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useCallback } from "react";
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from "@/components/form/Dialog";
import { Button } from "@/components/form/CustomButton";
import { motion, AnimatePresence } from "framer-motion";
import {
    AlertTriangle, CheckSquare, Square, PackageX,
    TrendingDown, ShieldAlert, RefreshCw, Loader2,
    ArrowUpDown, ChevronUp, ChevronDown, Zap,
    Building2, Send, CheckCircle2, Info,
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
    suggestedQty: number;  // maxStockLevel - currentStock
    costPrice: number;
    supplierId: string;
    supplierName: string;
    supplierEmail: string;
    daysUntilStockout?: number;   // currentStock / avgDailySales
    severity: "critical" | "warning" | "low";
}

interface ReplenishmentProposalsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    products: ReorderProduct[];
    onCreateOrders: (selected: ReorderProduct[]) => Promise<void>;
    isCreating?: boolean;
}

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY = {
    critical: {
        label: "Critical",
        icon: ShieldAlert,
        row: "bg-red-50/60",
        badge: "bg-red-100 text-red-700 border-red-300",
        dot: "bg-red-500",
    },
    warning: {
        label: "Reorder",
        icon: AlertTriangle,
        row: "bg-orange-50/40",
        badge: "bg-orange-100 text-orange-700 border-orange-300",
        dot: "bg-orange-500",
    },
    low: {
        label: "Low",
        icon: TrendingDown,
        row: "bg-amber-50/30",
        badge: "bg-amber-100 text-amber-700 border-amber-300",
        dot: "bg-amber-400",
    },
} as const;

// ─── Stock bar ────────────────────────────────────────────────────────────────

function StockBar({ current, max, reorder }: {
    current: number; max: number; reorder: number;
}) {
    if (max <= 0) return null;
    const currentPct = Math.min((current / max) * 100, 100);
    const reorderPct = Math.min((reorder / max) * 100, 100);
    const color =
        currentPct <= 10 ? "bg-red-500" :
            currentPct <= 25 ? "bg-orange-500" :
                currentPct <= 40 ? "bg-amber-400" : "bg-green-500";

    return (
        <div className="relative h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
            <div className={`absolute left-0 top-0 h-full rounded-full ${color}`} style={{ width: `${currentPct}%` }} />
            {/* Reorder marker */}
            <div className="absolute top-0 h-full w-0.5 bg-red-400 opacity-70" style={{ left: `${reorderPct}%` }} />
        </div>
    );
}

// ─── Sort hook ────────────────────────────────────────────────────────────────

type SortKey = "productName" | "currentStock" | "suggestedQty" | "severity" | "supplierName";
type SortDir = "asc" | "desc";

const SEVERITY_ORDER = { critical: 0, warning: 1, low: 2 };

// ─── Main Modal ───────────────────────────────────────────────────────────────

// Th moved to module scope to avoid creating components during render
function Th({ label, sortable, sk, sortKey, sortDir, onToggle }: {
    label: string;
    sortable?: SortKey;
    sk?: boolean;
    sortKey?: SortKey;
    sortDir?: SortDir;
    onToggle?: (k: SortKey) => void;
}) {
    return (
        <th
            className={`px-3 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wide ${sortable ? "cursor-pointer select-none hover:text-gray-900 group" : ""}`}
            onClick={() => sortable && onToggle && onToggle(sortable)}
        >
            <div className="flex items-center gap-1">
                {label}
                {sortable && (
                    sortKey === sortable
                        ? (sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-indigo-600" /> : <ChevronDown className="h-3 w-3 text-indigo-600" />)
                        : <ArrowUpDown className="h-3 w-3 text-gray-300 group-hover:text-gray-500" />
                )}
            </div>
        </th>
    );
}


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

    // ── Th with sort ──────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────────────
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">

                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 shrink-0">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                Replenishment Proposals
                            </h2>
                            <p className="text-orange-100 text-sm mt-1">
                                {products.length} product{products.length !== 1 ? "s" : ""} require stock replenishment
                                {criticalCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                                        {criticalCount} critical
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-orange-100 text-xs">Each supplier group = one PO</p>
                            <p className="text-white text-xs font-semibold mt-0.5">PO numbers auto-generated</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mt-4">
                        <input
                            type="text"
                            value={filterText}
                            onChange={e => setFilterText(e.target.value)}
                            placeholder="Filter by product, SKU or supplier..."
                            className="w-full h-9 px-3 rounded-lg border-0 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-orange-200"
                        />
                    </div>
                </div>

                {/* ── Stats bar ── */}
                {selected.size > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="px-6 py-3 bg-indigo-50 border-b border-indigo-200 shrink-0"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm">
                                <span className="font-bold text-indigo-700">{selected.size} selected</span>
                                <span className="text-gray-600">
                                    <span className="font-semibold text-indigo-600">{uniqueSuppliers}</span> supplier{uniqueSuppliers !== 1 ? "s" : ""} → {uniqueSuppliers} PO{uniqueSuppliers !== 1 ? "s" : ""} will be created
                                </span>
                                <span className="text-gray-600">
                                    Est. order value: <span className="font-semibold text-emerald-700">£{totalOrderValue.toFixed(2)}</span>
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelected(new Set())}
                                className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                                Clear selection
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── Table ── */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {visible.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <PackageX className="h-12 w-12 mb-3 opacity-40" />
                            <p className="font-semibold">No products match your filter</p>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-gray-50 border-b-2 border-gray-200 z-10">
                                <tr>
                                    {/* Select all checkbox */}
                                    <th className="px-4 py-3 w-10">
                                        <button type="button" onClick={toggleAll} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                            {allSelected
                                                ? <CheckSquare className="h-4.5 w-4.5 text-indigo-600" />
                                                : someSelected
                                                    ? <div className="h-4 w-4 rounded border-2 border-indigo-400 bg-indigo-100 flex items-center justify-center"><div className="h-1.5 w-2.5 bg-indigo-500 rounded-sm" /></div>
                                                    : <Square className="h-4 w-4" />}
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
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => toggleOne(product.productId)}
                                            className={`border-b border-gray-100 cursor-pointer transition-colors ${isChecked
                                                ? "bg-indigo-50 hover:bg-indigo-100"
                                                : `${sev.row} hover:bg-indigo-50/50`
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="px-4 py-3">
                                                <div className="text-gray-400">
                                                    {isChecked
                                                        ? <CheckSquare className="h-4 w-4 text-indigo-600" />
                                                        : <Square className="h-4 w-4" />}
                                                </div>
                                            </td>

                                            {/* Severity badge */}
                                            <td className="px-3 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${sev.badge}`}>
                                                    <SevIcon className="h-3 w-3" />
                                                    {sev.label}
                                                </span>
                                            </td>

                                            {/* Product */}
                                            <td className="px-3 py-3">
                                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">{product.productName}</p>
                                                <p className="text-xs text-gray-500 font-mono">{product.sku}</p>
                                            </td>

                                            {/* Stock */}
                                            <td className="px-3 py-3">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-sm font-bold ${product.severity === "critical" ? "text-red-600" :
                                                            product.severity === "warning" ? "text-orange-600" : "text-amber-600"
                                                            }`}>
                                                            {product.currentStock}
                                                        </span>
                                                        <span className="text-xs text-gray-400">/ {product.maxStockLevel}</span>
                                                    </div>
                                                    <StockBar
                                                        current={product.currentStock}
                                                        max={product.maxStockLevel}
                                                        reorder={product.reorderPoint}
                                                    />
                                                    <p className="text-[10px] text-gray-400">reorder at {product.reorderPoint}</p>
                                                </div>
                                            </td>

                                            {/* Suggested qty */}
                                            <td className="px-3 py-3">
                                                <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                                    {product.suggestedQty}
                                                </span>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Order-up-to-max</p>
                                            </td>

                                            {/* Unit cost */}
                                            <td className="px-3 py-3 text-sm text-gray-700">
                                                £{product.costPrice.toFixed(2)}
                                            </td>

                                            {/* Line total */}
                                            <td className="px-3 py-3">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    £{lineTotal.toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Supplier */}
                                            <td className="px-3 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`h-2 w-2 rounded-full shrink-0 ${product.supplierId ? "bg-green-500" : "bg-gray-300"}`} />
                                                    <span className="text-xs text-gray-700 truncate max-w-[100px]">{product.supplierName || "—"}</span>
                                                </div>
                                                {product.supplierEmail && (
                                                    <p className="text-[10px] text-gray-400 truncate max-w-[110px]">{product.supplierEmail}</p>
                                                )}
                                            </td>

                                            {/* Days left */}
                                            <td className="px-3 py-3 text-center">
                                                {product.daysUntilStockout != null ? (
                                                    <span className={`text-sm font-bold ${product.daysUntilStockout <= 3 ? "text-red-600" :
                                                        product.daysUntilStockout <= 7 ? "text-orange-600" :
                                                            product.daysUntilStockout <= 14 ? "text-amber-600" : "text-gray-700"
                                                        }`}>
                                                        {product.daysUntilStockout}d
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-gray-400">—</span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-200 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Info className="h-3.5 w-3.5" />
                            <span>
                                Products are grouped by supplier — each supplier generates one PO with a unique number.
                                Supplier emails are sent automatically on confirm.
                            </span>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isCreating}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={selected.size === 0 || isCreating}
                                type="button"
                                className={`flex items-center gap-2 ${selected.size > 0
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {isCreating ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Creating {uniqueSuppliers} PO{uniqueSuppliers !== 1 ? "s" : ""}…</>
                                ) : (
                                    <><Send className="h-4 w-4" /> Create {uniqueSuppliers > 0 ? `${uniqueSuppliers} ` : ""}Purchase Order{uniqueSuppliers !== 1 ? "s" : ""} & Email Suppliers</>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}