"use client";
import { motion } from "framer-motion";
import SummaryStats from "./SummaryStats";
import RoleFilterBar from "./RoleFilterBar";
import RolesHeader from "./RolesHeader";
import AvailableRoles from "./AvailableRoles";

const USerRoles = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <RolesHeader />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <SummaryStats />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <RoleFilterBar />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <AvailableRoles />
      </motion.div>
    </div>
  );
};

export default USerRoles;
