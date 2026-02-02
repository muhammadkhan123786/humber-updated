"use client";
import { useState, useEffect } from "react";
import AdminDashboard from "./components/admindashboard/AdminDashboard";
import TechnicianDashboard from "./techniciandashboard/components/TechnicianDashboard";

export default function Dashboard() {
    const [roleId, setRoleId] = useState<number | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("roleId");
        setTimeout(() => setRoleId(storedRole ? Number(storedRole) : null), 0);
    }, []);

    if (roleId === null) return <p>Loading...</p>; // wait for client-side load
    if (roleId === 1) return <AdminDashboard />
    if (roleId === 2) return <TechnicianDashboard />
    return <>
        <h1>Unknow role.</h1>
    </>
}
