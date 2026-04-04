import { getRegistrations } from "../actions/register";
import { getAllProductsForAdmin, getAdminStats, deleteProductByAdmin, toggleProductVisibility } from "../actions/admin";
import { getAllTeamMembers } from "../actions/team";
import { getAllOrders } from "../actions/orderActions";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  // Fetch all data on server side
  const [registrationsRes, productsRes, statsRes, teamRes, ordersRes] = await Promise.all([
    getRegistrations(),
    getAllProductsForAdmin(50),
    getAdminStats(),
    getAllTeamMembers(20),
    getAllOrders(),
  ]);

  const initialData = {
    registrations: registrationsRes.success ? registrationsRes.data || [] : [],
    products: productsRes.success ? productsRes.data || [] : [],
    stats: statsRes.success ? statsRes.data : null,
    teamMembers: teamRes.success ? teamRes.data || [] : [],
    deliveryRequests: ordersRes.success ? ordersRes.data || [] : [],
  };

  return <DashboardClient initialData={initialData} />;
}
