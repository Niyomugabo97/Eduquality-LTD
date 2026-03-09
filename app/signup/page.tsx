// signup/page.tsx
import SignupForm from "@/components/SignupForm"; // path to your SignupForm
import Footer from "@/components/Footer";

export default function SignupPage() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Sign Up
          </h1>
          <SignupForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}