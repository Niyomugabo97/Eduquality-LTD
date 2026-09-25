import { requireAdminAuth } from "@/app/actions/auth";
import Footer from "@/components/Footer";
import { getContacts } from "@/app/actions/contactActions";
import LogoutButton from "../_components/logout-button";
import ContactsTable from "./_components/contact-table";

export default async function ContactsDashboardPage() {
  await requireAdminAuth(); // Ensure only authenticated admins can access

  const { data: contacts, success, message } = await getContacts();

  if (!success) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-12 mt-24">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Contact Messages
          </h1>
          <div className="text-red-500">
            {message || "An error occurred while loading contact messages."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12 mt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
          <LogoutButton />
        </div>
        <ContactsTable initialContacts={contacts || []} />
      </div>
    </main>
  );
}
