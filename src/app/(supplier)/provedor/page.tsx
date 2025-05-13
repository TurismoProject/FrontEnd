"use client";

import { useState } from "react";
import { Sidebar } from "@/components/pages/supplier/Sidebar";
import { AddProductDialog } from "@/components/pages/supplier/AddProductDialog";
import { DashboardContent } from "@/components/pages/supplier/DashboardContent";

export default function SupplierDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onAddProductClick={() => setAddProductOpen(true)}
      />
      <main
        className={`flex-1 p-6 md:mr-4 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-24"
        }`}
      >
        <DashboardContent />
      </main>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
      />
    </div>
  );
}
