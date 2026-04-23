"use client";

import { useState } from "react";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { CategoryPage } from "./components/category/CategoryPage";
import { Category } from "./types";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "category">("dashboard");
  const [activeCat, setActiveCat] = useState<Category | null>(null);

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
          <DashboardPage onNavigate={navigateToCategory} />
        ) : (
          activeCat && <CategoryPage cat={activeCat} onBack={goHome} />
        )}
      </div>
    </>
  );
}
