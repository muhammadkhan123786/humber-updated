"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Car, Plus, Search,Loader2 } from "lucide-react";
import BrandTable from "./BrandTable";
import BrandForm from "./BrandForm";
import Pagination from "./Pagination"; // Import your Pagination component
import { IVehicleBrand } from "../types";

const THEME_COLOR = "#FE6B1D";
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${BASE_URL}/vehiclebrand`;

export default function VehicleBrandClient() {
  const [brands, setBrands] = useState<IVehicleBrand[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<IVehicleBrand | null>(null);
  const [loading, setLoading] = useState(true);

  // --- 1. Added Pagination States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- 2. Updated fetchBrands to accept a page number and search term ---
  const fetchBrands = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token"); 
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = savedUser.id || savedUser._id;

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        // Added page, limit, and search to params
        params: { 
          userId: userId,
          page: page,
          limit: 10,
          search: search
        } 
      });

      if (res.data && Array.isArray(res.data.data)) {
        setBrands(res.data.data);
        // --- 3. Update total pages from response ---
        setTotalPages(Math.ceil(res.data.total / 10) || 1);
        setCurrentPage(page);
      } else {
        setBrands([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(1, searchTerm); // Fetch first page on load or search change
  }, [searchTerm]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payloadData = JSON.parse(window.atob(base64));
      const userId = payloadData.userId;

      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userId }
      });

      alert("Brand deleted successfully");
      fetchBrands(currentPage, searchTerm); // Refresh current page with search
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete brand");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: THEME_COLOR }}>
              <Car size={36} /> Vehicle Brands
            </h1>
            <p className="text-gray-500 mt-1">Add, update or remove vehicle brands from your system</p>
          </div>
          <button
            onClick={() => { setEditingBrand(null); setShowForm(true); }}
            className="flex items-center gap-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
            style={{ backgroundColor: THEME_COLOR }}
          >
            <Plus size={22} /> Add Brand
          </button>
        </div>

        {/* Search Bar Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex items-center gap-3 border border-gray-100">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by brand name..."
            className="w-full outline-none text-gray-700 bg-transparent text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Modals */}
        {(showForm || editingBrand) && (
          <BrandForm
            editingBrand={editingBrand}
            onClose={() => { setShowForm(false); setEditingBrand(null); }}
            onRefresh={() => fetchBrands(currentPage, searchTerm)} // Refresh current page with search after edit/add
            themeColor={THEME_COLOR}
            apiUrl={API_URL}
          />
        )}

        {/* Table and Pagination */}
        {loading ? (
                  <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-orange-500" size={48} /></div>

        ) : (
          <>
            <BrandTable
              data={brands}
              onEdit={(brand) => setEditingBrand(brand)}
              onDelete={handleDelete}
              themeColor={THEME_COLOR}
            />
            
            {/* --- 4. Added Pagination Component here --- */}
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => fetchBrands(page, searchTerm)}
            />
          </>
        )}

        {!loading && brands.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-lg">No brands found.</p>
          </div>
        )}
      </div>
    </div>
  );
}