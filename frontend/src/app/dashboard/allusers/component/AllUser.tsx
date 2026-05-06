"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SystemUsersDashboard from "./SystemUsersDashboard";
import FilterSection from "./FilterSection";
import UserCard from "./UserCard";
import ManagementSection from "./managementCards";

const AllUser = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to refresh dashboard stats and user list
    const refreshData = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <SystemUsersDashboard refreshTrigger={refreshTrigger} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <FilterSection />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
            >
                <UserCard onUserUpdate={refreshData} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                <ManagementSection />
            </motion.div>
        </div>
    );
};

export default AllUser;