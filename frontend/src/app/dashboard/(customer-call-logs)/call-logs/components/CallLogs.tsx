import React from "react";
import CallLogHeader from "./CallLogHeader";
import CallRecordsTable from "./CallRecordsTable";

const CallLogs = () => {
  return (
    <div className="p-5">
      <div>
        <CallLogHeader />
      </div>
      <div className="mt-4">
        <CallRecordsTable />
      </div>
    </div>
  );
};

export default CallLogs;
