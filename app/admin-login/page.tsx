import Footer from "@/components/Footer";
import LoginForm from "@/components/login-form";
import SignupForm from "@/components/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminLoginPage() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Admin Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                User Signup
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  Sign In to Admin Panel
                </h2>
                <LoginForm isAdmin={true} />
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                  User Registration
                </h2>
                <SignupForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
