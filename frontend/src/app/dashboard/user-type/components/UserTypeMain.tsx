"use client";
import { motion } from "framer-motion";
import UserStatsHeader from "./UserStatsHeader";
import UserTypeGrid from "./UserTypeGrid";

const USerType = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <UserStatsHeader />
      <UserTypeGrid />
    </motion.div>
  );
};

export default USerType;
