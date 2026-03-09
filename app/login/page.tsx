import Footer from "@/components/Footer";
import LoginForm from "@/components/login-form";

export default async function LoginPage() {
  return (
    <main>
      <LoginForm isAdmin={false} /> {/* Normal user login */}
      <Footer />
    </main>
  );
}