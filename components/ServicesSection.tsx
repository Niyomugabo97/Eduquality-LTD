import { MessageSquare, Send } from "lucide-react";
import Link from "next/link";

const services = [
  {
    id: 1,
    title: "School Strategic Planning",
    description: "Comprehensive strategic planning services for educational institutions including curriculum development, academic planning, and institutional growth strategies.",
    image: "/images/strategic-plan.png",
    date: "Education",
    comments: "Strategic Planning",
  },
  {
    id: 2,
    title: "School Action Plans",
    description: "Development and implementation of effective school action plans with clear objectives, measurable outcomes, and continuous improvement processes.",
    image: "/images/action-plan.jpg",
    date: "Education",
    comments: "Action Planning",
  },
  {
    id: 3,
    title: "Annual Budgeting",
    description: "Professional annual budgeting services for schools and organizations, including financial planning, resource allocation, and expense management.",
    image: "/images/budget.jpg",
    date: "Finance",
    comments: "Budget Management",
  },
  {
    id: 4,
    title: "Human Resource Management",
    description: "Complete HR management solutions including recruitment, training, performance management, and employee development programs.",
    image: "/images/human-resource-mgmt.jpg",
    date: "Management",
    comments: "HR Services",
  },
  {
    id: 5,
    title: "Job Contract Design",
    description: "Professional job contract design and development services ensuring compliance, clarity, and fair employment practices.",
    image: "/images/contract.webp",
    date: "Legal",
    comments: "Contract Services",
  },
  {
    id: 6,
    title: "Child Protection Policies and Training",
    description: "Development and implementation of child protection policies, training programs, and safe environment creation for educational institutions.",
    image: "/images/nibeza-foundation.jpeg",
    date: "Protection",
    comments: "Child Safety",
  },
  {
    id: 7,
    title: "Wholesale School Materials",
    description: "Bulk supply of educational materials including computers, books, stationery, and learning resources for schools.",
    image: "/images/school-materials.jpg",
    date: "Supply",
    comments: "Educational Materials",
  },
  {
    id: 8,
    title: "Snack Production and Manufacturing",
    description: "Large-scale snack production and manufacturing services with quality control and distribution capabilities.",
    image: "/images/snacks-production.jpg",
    date: "Production",
    comments: "Food Manufacturing",
  },
  {
    id: 9,
    title: "Delivery Services",
    description: "Comprehensive delivery services within Rwanda and international shipping for efficient logistics and supply chain management.",
    image: "/images/delivery.jpg",
    date: "Logistics",
    comments: "Delivery Solutions",
  },
  {
    id: 10,
    title: "Beauty and Personal Care Services",
    description: "Professional beauty services and personal care products including salon treatments, skincare, and wellness programs.",
    image: "/images/beauty.jpg",
    date: "Beauty",
    comments: "Personal Care",
  },
  {
    id: 11,
    title: "Snack Production Service",
    description: "Specialized snack production service with custom formulations, packaging, and quality assurance for various markets.",
    image: "/images/snacks-production-service.jpg",
    date: "Production",
    comments: "Custom Snacks",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-[#0066FF]">Our Services</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="flex">
                <div className="relative w-2/5 h-48">
                  <img
                    src={service.image || "/images/eduquality-service.jpg"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-blue-600/90 text-white rounded-lg px-2 py-1 backdrop-blur-sm">
                    <div className="text-lg font-bold leading-none">
                      {service.id.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs opacity-90">{service.date}</div>
                  </div>
                </div>
                <div className="w-3/5 p-4 flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-50">
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900 mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-800 font-medium text-sm group-hover:text-blue-600 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center text-gray-500 text-[14px] cursor-pointer">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>{service.comments}</span>
                    </div>
                    <div>
                      <Link href={"/contact/#contact-form"}>
                        <Send className="w-4 h-4 text-blue-600 cursor-pointer" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
