"use client";

import { useState, useEffect } from "react";
import LogoutButton from "./_components/logout-button";
import AdminStats from "./_components/admin-stats";
import TeamManagement from "./_components/team-management";
import FoundationRecords from "./_components/foundation-records";
import { getRegistrations } from "../actions/register";
import { getAdminStats } from "../actions/admin";
import { getAllTeamMembers } from "../actions/team";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BarChart3, 
  Users2, 
  FileText, 
  Settings,
  Plus,
  X,
  UserCheck,
  Award,
  Menu,
  Users,
  Newspaper,
  CalendarDays,
  MapPin,
  Send,
  Image as ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";

interface DashboardPost {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  media?: { images?: string[]; mainImage?: string };
}

const allServices = [
  "Management Consultancy",
  "Business Strategy Development",
  "Chemical Manufacturing",
  "Fertilizers & Nitrogen Compounds",
  "Pesticides & Agrochemicals",
  "Paints & Coatings",
  "Soap & Detergents",
  "Global Trading Services",
  "Wholesale Trade",
  "Airtime Service Retail",
  "Cargo Handling",
];

export default function DashboardPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
  });
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");

  useEffect(() => {
    fetchData();
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts", { cache: "no-store" });
      const result = await response.json();
      if (response.ok && result.success) setPosts(result.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [registrationsRes, statsRes, teamRes] = await Promise.all([
        getRegistrations(),
        getAdminStats(),
        getAllTeamMembers(20),
      ]);

      if (registrationsRes.success) {
        setRegistrations(registrationsRes.data || []);
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }

      if (teamRes.success) {
        setTeamMembers(teamRes.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setRegistrations([]);
      setTeamMembers([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPublishMessage("");

    if (!postForm.title.trim() || !postForm.description.trim()) {
      setPublishMessage("Please provide a title and description before publishing.");
      return;
    }

    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append("title", postForm.title);
      formData.append("description", postForm.description);
      formData.append("date", postForm.date || new Date().toISOString().slice(0, 10));
      formData.append("location", postForm.location);
      formData.append("imageUrl", postForm.imageUrl);
      if (selectedImage) formData.append("image", selectedImage);

      const wasEditing = Boolean(editingPostId);
      const response = await fetch(editingPostId ? `/api/posts/${editingPostId}` : "/api/posts", {
        method: editingPostId ? "PATCH" : "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to publish post.");
      }

      setPostForm({ title: "", description: "", date: "", location: "", imageUrl: "" });
      setEditingPostId(null);
      setSelectedImage(null);
      setPublishMessage(wasEditing ? "Post updated successfully." : "Post published successfully to the public page.");
      await fetchPosts();
    } catch (error: any) {
      console.error("Error publishing post:", error);
      setPublishMessage(error.message || "Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  const handleEditPost = (post: DashboardPost) => {
    setEditingPostId(post.id);
    setSelectedImage(null);
    setPostForm({
      title: post.title,
      description: post.description,
      date: post.date?.slice(0, 10) || "",
      location: post.location || "",
      imageUrl: post.media?.mainImage || post.media?.images?.[0] || "",
    });
    setPublishMessage("");
    setActiveTab("posts");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePost = async (post: DashboardPost) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return;
    setDeletingPostId(post.id);
    setPublishMessage("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to delete post.");
      setPosts((currentPosts) => currentPosts.filter((item) => item.id !== post.id));
      if (editingPostId === post.id) {
        setEditingPostId(null);
        setPostForm({ title: "", description: "", date: "", location: "", imageUrl: "" });
        setSelectedImage(null);
      }
      setPublishMessage("Post deleted successfully.");
    } catch (error) {
      setPublishMessage(error instanceof Error ? error.message : "Failed to delete post.");
    } finally {
      setDeletingPostId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="flex-grow container mx-auto px-4 py-12 mt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-12 mt-20 sm:mt-24">
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-8 mb-6 sm:mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3" />
                NIBEZA Foundation Dashboard
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg">Beneficiary care and programme administration</p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
          <div className="w-10"></div>
        </div>

        {/* Mobile Sidebar */}
        <div className={`sm:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Admin Navigation</h3>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "overview" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => { setActiveTab("users"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "users" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Users2 className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </button>
              <button
                onClick={() => { setActiveTab("posts"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "posts" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">Publish Post</span>
              </button>
              <button
                onClick={() => { setActiveTab("registrations"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "registrations" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Beneficiaries</span>
              </button>
              <button
                onClick={() => { setActiveTab("exits"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "exits"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Exit Requests</span>
              </button>
              <button
                onClick={() => { setActiveTab("team"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "team" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Team</span>
              </button>
              <button
                onClick={() => { setActiveTab("posts"); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === "posts" 
                    ? "bg-blue-600 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Newspaper className="w-5 h-5" />
                <span className="font-medium">Publish Post</span>
              </button>
            </nav>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop Tabs - Hidden on Mobile */}
          <TabsList className="hidden sm:grid w-full grid-cols-3 md:grid-cols-6 xl:grid-cols-11 gap-1 sm:gap-2 bg-white rounded-lg sm:rounded-xl shadow-md p-1 sm:p-2 overflow-x-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Users2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Users</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Publish Post</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Beneficiaries</span>
            </TabsTrigger>
            <TabsTrigger value="exits" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Exit Requests</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Team</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg py-2 sm:py-3 px-1 sm:px-4 min-w-0">
              <Newspaper className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="text-center">Posts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <AdminStats
                totalUsers={stats.totalUsers}
                totalProducts={stats.totalProducts}
                recentUsers={stats.recentUsers}
                recentProducts={stats.recentProducts}
              />
            )}
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4 sm:space-y-6">
            <FoundationRecords type="beneficiaries" />
          </TabsContent>

          <TabsContent value="exits" className="space-y-4 sm:space-y-6">
            <FoundationRecords type="exits" />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Registered Users & Board Members
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <Users2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                      Service Registrations
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {registrations.slice(0, 5).map((reg, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{reg.name}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{reg.email}</p>
                          </div>
                          <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium shrink-0">
                            {reg.selectedServices?.length || 0} services
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 flex items-center">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                      Board of Directors
                    </h3>
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 sm:p-5 rounded-xl border border-indigo-100">
                      <TeamManagement 
                        initialTeamMembers={teamMembers}
                        onUpdate={fetchData}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Publish Post Tab */}
          <TabsContent value="posts" className="space-y-4 sm:space-y-6">
            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6">
                <CardTitle className="flex items-center text-lg sm:text-xl">
                  <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  Publish Activity or Event
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form onSubmit={handlePublishPost} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <Input
                        value={postForm.title}
                        onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                        placeholder="e.g. School Support for Children in Need"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <Textarea
                        value={postForm.description}
                        onChange={(event) => setPostForm({ ...postForm, description: event.target.value })}
                        placeholder="Write the event or activity summary here..."
                        rows={6}
                        className="resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        Date
                      </label>
                      <Input
                        type="date"
                        value={postForm.date}
                        onChange={(event) => setPostForm({ ...postForm, date: event.target.value })}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Location
                      </label>
                      <Input
                        value={postForm.location}
                        onChange={(event) => setPostForm({ ...postForm, location: event.target.value })}
                        placeholder="Kigali, Rwanda"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-blue-600" />
                        Upload image from computer
                      </label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                        className="h-auto min-h-11 py-2"
                      />
                      <p className="text-xs text-gray-500">
                        {selectedImage ? selectedImage.name : editingPostId && postForm.imageUrl ? "Choose a new image to replace the current one, or leave this empty to keep it." : "Choose an image file to upload."}
                      </p>
                    </div>
                  </div>

                  {publishMessage ? (
                    <div className={`rounded-lg border px-3 py-2 text-sm ${publishMessage.includes("success") ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                      {publishMessage}
                    </div>
                  ) : null}

                  <div className="flex justify-end">
                    <Button type="submit" disabled={publishing} className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                      <Send className="mr-2 h-4 w-4" />
                      {publishing ? (editingPostId ? "Saving..." : "Publishing...") : (editingPostId ? "Save Changes" : "Publish Post")}
                    </Button>
                    {editingPostId ? (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={publishing}
                        onClick={() => {
                          setEditingPostId(null);
                          setSelectedImage(null);
                          setPostForm({ title: "", description: "", date: "", location: "", imageUrl: "" });
                          setPublishMessage("");
                        }}
                      >
                        Cancel
                      </Button>
                    ) : null}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader>
                <CardTitle>Published activities and events</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-gray-200 p-4 sm:p-6">
                {posts.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">No published posts yet.</p>
                ) : posts.map((post) => {
                  const image = post.media?.mainImage || post.media?.images?.[0];
                  return (
                    <div key={post.id} className="flex flex-col gap-4 py-4 first:pt-0 sm:flex-row sm:items-center">
                      {image ? <img src={image} alt="" className="h-20 w-full rounded-md object-cover sm:w-28" /> : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900">{post.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{post.description}</p>
                        <p className="mt-1 text-xs text-gray-500">{post.date}{post.location ? ` · ${post.location}` : ""}</p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <Button type="button" variant="outline" size="sm" disabled={deletingPostId === post.id} onClick={() => void handleDeletePost(post)} className="text-red-700 hover:text-red-800">
                          <Trash2 className="mr-2 h-4 w-4" /> {deletingPostId === post.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </main>
  );
}
