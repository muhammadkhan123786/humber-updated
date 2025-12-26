

import EarnStatisticBarGraph from "../app/dashboard/components/ui/EarnStatisticBarGraph";
import WarrantyClaims from "../app/dashboard/components/ui/WarrantyClaims";
import DashboardGridView from "../app/dashboard/components/ui/DashboardGridView";
import CustomerPaymentStatus from "../app/dashboard/components/ui/CustomerPaymentStatus";
import BranchStatus from "../app/dashboard/components/ui/BranchStatus";
import TopPerfomerTechnicians from "../app/dashboard/components/ui/TopPerformerTechnicians";
import CountriesStatus from "../app/dashboard/components/ui/CountriesStatus";
import TopTechnicians from "../app/dashboard/components/ui/TopTechnicians";
import LatestServices from "../app/dashboard/components/ui/LatestServices";
import RevenueGrowthGraph from "@/app/dashboard/components/ui/RevenueGrowthGraph";

import { FC } from "react";


export const ADMIN_MAIN_DASHBOARDCOMPONENTS: FC[] = [
    DashboardGridView,
    RevenueGrowthGraph,
    EarnStatisticBarGraph,
    WarrantyClaims,
    CustomerPaymentStatus,
    BranchStatus,
    // TopPerfomerTechnicians,
    // CountriesStatus,
    TopTechnicians,
    LatestServices
]


