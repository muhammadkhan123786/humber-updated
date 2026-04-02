"use client";
import React, { useState } from "react";
import CallLogHeader from "./CallLogHeader";
import CallRecordsTable from "./CallRecordsTable";
import { useCallLogs } from "../../../../../hooks/useCallLogsHook";

const CallLogs = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingData, setEditingData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    callType: "all",
    date: "",
  });

  const { dropdowns } = useCallLogs();

  const handleEditRequest = (record: any) => {
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-5">
      <div>
        <CallLogHeader
          onSuccess={handleRefresh}
          editingData={editingData}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onClose={handleCloseModal}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="mt-4">
        <CallRecordsTable
          refreshKey={refreshKey}
          onEdit={handleEditRequest}
          filters={filters}
          callStatuses={dropdowns.callStatuses}
        />
      </div>
    </div>
  );
};

export default CallLogs;
