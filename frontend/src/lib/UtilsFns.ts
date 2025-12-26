import { NavLinksInterface } from "@/types/NavLinksInterface";
import { NavBarLinksData } from "@/data/permissions";

export function getRoleBaseNavBarLinks(roleId: number): NavLinksInterface[] {
    return NavBarLinksData.filter((link) => link.roleId?.includes(roleId));
}