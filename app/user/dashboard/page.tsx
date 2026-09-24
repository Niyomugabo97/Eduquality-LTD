"use client";

import { getUserSession } from "@/app/actions/auth";
import SellerChatInbox from "./_components/seller-chat-inbox";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserDashboard() {
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const userSession = await getUserSession();
      if (!userSession) {
        redirect("/login");
        return;
      }

      setUser({ id: userSession.id, name: userSession.name });
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
          <p className="mt-2 text-blue-100">Manage your account messages.</p>
        </div>

        <SellerChatInbox userId={user.id} userName={user.name} />

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
