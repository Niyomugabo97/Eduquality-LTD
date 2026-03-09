import Footer from "@/components/Footer";
import LoginForm from "@/components/login-form";

export default async function AdminLoginPage() {
  return (
    <main>
      <LoginForm isAdmin={true} /> {/* Admin login */}
      <Footer />
    </main>
  );
}
