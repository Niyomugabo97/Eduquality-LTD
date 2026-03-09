import { getUserSession } from "@/app/actions/auth";
import { getUserProducts } from "@/app/actions/product";
import { redirect } from "next/navigation";
import SimpleEnhancedProductUploadForm from "@/components/SimpleEnhancedProductUploadForm";
import SimpleEnhancedProductCard from "@/components/SimpleEnhancedProductCard";

export default async function UserDashboard() {
  const user = await getUserSession();
  
  if (!user) {
    redirect("/login");
  }

  const products = await getUserProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-600">
            Manage and upload your products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <SimpleEnhancedProductUploadForm />
          </div>

          {/* Right Column - Products */}
          <div className="lg:col-span-2">
            {products && products.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <div key={product.id}>
                      <SimpleEnhancedProductCard product={product} currentUser={user} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No products uploaded yet.</p>
                <p className="text-gray-400">Upload your first product using the form on the left!</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <a
            href="/"
            className="inline-block bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
