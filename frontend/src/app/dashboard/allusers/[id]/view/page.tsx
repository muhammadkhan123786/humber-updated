"use client";

import { useParams } from "next/navigation";
import UserViewPage from "../../component/UserViewPage";

export default function UserViewRoute() {
    const params = useParams();
    const userId = params.id as string;
     return <UserViewPage userId={userId} />;
}