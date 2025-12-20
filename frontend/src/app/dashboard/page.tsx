"use client";
import { useState, useEffect } from "react";
import AdminDashboard from "./components/admindashboard/AdminDashboard";

export default function Dashboard() {
    const [roleId, setRoleId] = useState<number | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("roleId");
        setTimeout(() => setRoleId(storedRole ? Number(storedRole) : null), 0);
    }, []);

    if (roleId === null) return <p>Loading...</p>; // wait for client-side load

    return (
        <>
            {roleId === 1 ? <AdminDashboard /> : <p>You are not admin</p>}
        </>
    );
}
