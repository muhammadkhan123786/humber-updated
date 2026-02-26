import React from "react";
import PermissionsManager from "./PermissionsManager";
import PermissionsList from "./PermissionsList";
import PermissionMatrixFooter from "./PermissionMatrixFooter";

const Permissions = () => {
  return (
    <div>
      <PermissionsManager />
      <PermissionsList />
      <PermissionMatrixFooter />
    </div>
  );
};

export default Permissions;
