import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, UserPlus, TrendingUp } from "lucide-react";

interface AdminStatsProps {
  totalUsers: number;
  totalProducts: number;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  recentProducts: Array<{
    id: string;
    title: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

export default function AdminStats({ 
  totalUsers, 
  totalProducts, 
  recentUsers, 
  recentProducts 
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-800">Total Users</CardTitle>
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalUsers.toLocaleString()}</div>
          <p className="text-xs text-gray-600 mt-1">
            Registered users
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-800">Total Products</CardTitle>
          <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{totalProducts.toLocaleString()}</div>
          <p className="text-xs text-gray-600 mt-1">
            Uploaded products
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-800">New Users</CardTitle>
          <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{recentUsers.length}</div>
          <p className="text-xs text-gray-600 mt-1">
            Recently joined
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-800">Activity</CardTitle>
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="text-xl sm:text-2xl font-bold text-gray-900">{recentProducts.length}</div>
          <p className="text-xs text-gray-600 mt-1">
            Recent uploads
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
