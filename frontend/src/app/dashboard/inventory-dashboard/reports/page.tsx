"use client";

import { useState } from "react";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { CategoryPage } from "./components/category/CategoryPage";
import { Category } from "./types";
import { CATEGORIES, QUICK_STATS } from "./constants/categories";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "category">("dashboard");
  const [activeCat, setActiveCat] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = CATEGORIES?.filter((cat) => {
    const matches =
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      cat.desc.toLowerCase().includes(search.toLowerCase());
    return matches && (filter === "All" || cat.id === filter);
  });
  const navigateToCategory = (cat: Category) => {
    setActiveCat(cat);
    setView("category");
  };

  const goHome = () => {
    setView("dashboard");
    setActiveCat(null);
  };

  return (
    <>
      <div>
        {view === "dashboard" ? (
          <DashboardPage onNavigate={navigateToCategory} filtered={filtered} />
        ) : (
          activeCat && <CategoryPage cat={activeCat} onBack={goHome} />
        )}
      </div>
    </>
  );
}
