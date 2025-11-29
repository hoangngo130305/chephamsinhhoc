import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import {
  LogOut,
  Package,
  FileText,
  Mail,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Search,
  Menu,
  X,
  Settings,
  Loader2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { ProductFormModal } from "./ProductFormModal";
import { ArticleFormModal } from "./ArticleFormModal";
import { ContactReplyModal } from "./ContactReplyModal";
import { SettingsForm } from "./SettingsForm";
import {
  getProducts,
  getProduct,
  getArticles,
  getArticle,
  getContacts,
  deleteProduct,
  deleteArticle,
  deleteContact,
  replyContact,
  logout as apiLogout,
  apiCall,
  updateProduct,
  createProduct,
  updateArticle,
  createArticle,
} from "../../src/lib/api";
import { debugAuth } from "../../src/lib/debug";

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = "overview" | "products" | "articles" | "contacts" | "settings";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface Product {
  id?: string; // Optional - undefined when creating new
  name: string;
  category: string;
  description: string;
  features: string[];
  usage: string;
  ingredients: string;
  benefits: string[];
  packaging: string[];
  images: string[];
  image_labels?: string[];
  status?: "active" | "inactive";
  is_popular?: boolean;
  sort_order?: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}

interface ArticleContent {
  intro: string;
  sections: {
    heading: string;
    content: string;
  }[];
  conclusion: string;
}

interface Article {
  id?: string; // Optional - undefined when creating new
  title: string;
  category: string;
  excerpt: string;
  content: string | ArticleContent;
  image: string;
  author: string;
  tags?: string[];
  status: "published" | "draft";
  is_featured?: boolean;
  view_count?: number;
  read_time?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  reply?: string;
  status: "new" | "replied";
  date: string; // For modal compatibility
  created_at: string;
  updated_at?: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [replyingContact, setReplyingContact] = useState<Contact | null>(null);

  // Data states - From API
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // Error states
  const [productsError, setProductsError] = useState<string | null>(null);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [contactsError, setContactsError] = useState<string | null>(null);

  // ============================================================
  // API CALLS
  // ============================================================

  // Fetch Products from API
  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      setProductsError(null);

      console.log("🔄 [Admin] Fetching products from API...");
      const data = await getProducts();
      const productsData = data.results || data;

      setProducts(productsData);
      console.log("✅ [Admin] Products loaded:", productsData.length);
    } catch (error: any) {
      console.error("❌ [Admin] Error fetching products:", error);
      setProductsError(error.message);
      toast.error("Không thể tải danh sách sản phẩm", {
        description: error.message,
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch Articles from API
  const fetchArticles = async () => {
    try {
      setIsLoadingArticles(true);
      setArticlesError(null);

      console.log("🔄 [Admin] Fetching articles from API...");
      const data = await getArticles();
      const articlesData = data.results || data;

      setArticles(articlesData);
      console.log("✅ [Admin] Articles loaded:", articlesData.length);
    } catch (error: any) {
      console.error("❌ [Admin] Error fetching articles:", error);
      setArticlesError(error.message);
      toast.error("Không thể tải danh sách bài viết", {
        description: error.message,
      });
    } finally {
      setIsLoadingArticles(false);
    }
  };

  // Fetch Contacts from API
  const fetchContacts = async () => {
    try {
      setIsLoadingContacts(true);
      setContactsError(null);

      console.log("🔄 [Admin] Fetching contacts from API...");
      const data = await getContacts();
      const contactsData = (data.results || data).map((contact: any) => ({
        ...contact,
        date: contact.created_at, // Map created_at to date for modal compatibility
      }));

      setContacts(contactsData);
      console.log("✅ [Admin] Contacts loaded:", contactsData.length);
    } catch (error: any) {
      console.error("❌ [Admin] Error fetching contacts:", error);
      setContactsError(error.message);
      toast.error("Không thể tải danh sách liên hệ", {
        description: error.message,
      });
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      console.log("🗑️ [Admin] Deleting product:", id);
      await deleteProduct(id);

      setProducts(products.filter((p) => p.id !== id));
      toast.success("Đã xóa sản phẩm!");
      console.log("✅ [Admin] Product deleted");
    } catch (error: any) {
      console.error("❌ [Admin] Error deleting product:", error);
      toast.error("Không thể xóa sản phẩm", {
        description: error.message,
      });
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      console.log("🗑️ [Admin] Deleting article:", id);
      await deleteArticle(id);

      setArticles(articles.filter((a) => a.id !== id));
      toast.success("Đã xóa bài viết!");
      console.log("✅ [Admin] Article deleted");
    } catch (error: any) {
      console.error("❌ [Admin] Error deleting article:", error);
      toast.error("Không thể xóa bài viết", {
        description: error.message,
      });
    }
  };

  // Delete Contact
  const handleDeleteContact = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa liên hệ này?")) return;

    try {
      console.log("🗑️ [Admin] Deleting contact:", id);
      await deleteContact(id);

      setContacts(contacts.filter((c) => c.id !== id));
      toast.success("Đã xóa liên hệ!");
      console.log("✅ [Admin] Contact deleted");
    } catch (error: any) {
      console.error("❌ [Admin] Error deleting contact:", error);
      toast.error("Không thể xóa liên hệ", {
        description: error.message,
      });
    }
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  // Load all data on mount
  useEffect(() => {
    console.log("🚀 [Admin] Dashboard mounted - Loading data from API...");

    // Debug auth status
    debugAuth();

    fetchProducts();
    fetchArticles();
    fetchContacts();
  }, []);

  // ============================================================
  // COMPUTED VALUES
  // ============================================================

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    totalContacts: contacts.length,
    newContacts: contacts.filter((c) => c.status === "new").length,
  };

  // Filter functions
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const LoadingState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );

  const ErrorState = ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <p className="text-gray-900 font-medium mb-1">Không thể tải dữ liệu</p>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      <Button
        onClick={onRetry}
        size="sm"
        variant="outline"
        className="border-blue-200 hover:border-blue-500 hover:bg-blue-50"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Thử lại
      </Button>
    </div>
  );

  const EmptyState = ({ message }: { message: string }) => (
    <div className="text-center py-12">
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                API Mode
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  fetchProducts();
                  fetchArticles();
                  fetchContacts();
                  toast.info("Đang làm mới dữ liệu...");
                }}
                className="hidden sm:flex"
              >
                <RefreshCw className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  apiLogout();
                  onLogout();
                }}
                className="hidden sm:flex"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Đăng xuất
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden pb-4 space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  fetchProducts();
                  fetchArticles();
                  fetchContacts();
                  toast.info("Đang làm mới dữ liệu...");
                }}
                className="w-full"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Làm mới
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  apiLogout();
                  onLogout();
                }}
                className="w-full"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Đăng xuất
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max sm:min-w-0">
            {[
              { id: "overview", label: "Tổng quan", icon: BarChart3 },
              { id: "products", label: "Sản phẩm", icon: Package },
              { id: "articles", label: "Bài viết", icon: FileText },
              { id: "contacts", label: "Liên hệ", icon: Mail },
              { id: "settings", label: "Cài đặt", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  {isLoadingProducts && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Sản phẩm</p>
                <div className="mt-2 text-xs text-green-600">
                  {stats.activeProducts} đang hoạt động
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  {isLoadingArticles && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalArticles}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Bài viết</p>
                <div className="mt-2 text-xs text-blue-600">
                  {stats.publishedArticles} đã xuất bản
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  {isLoadingContacts && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats.totalContacts}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Liên hệ</p>
                <div className="mt-2 text-xs text-orange-600">
                  {stats.newContacts} chưa phản hồi
                </div>
              </motion.div>
            </div>

            {/* API Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Trạng thái API
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !isLoadingProducts && !productsError
                          ? "bg-green-500"
                          : productsError
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">Products API</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {isLoadingProducts
                      ? "Đang tải..."
                      : productsError
                      ? "Lỗi"
                      : "Kết nối thành công"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !isLoadingArticles && !articlesError
                          ? "bg-green-500"
                          : articlesError
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">Articles API</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {isLoadingArticles
                      ? "Đang tải..."
                      : articlesError
                      ? "Lỗi"
                      : "Kết nối thành công"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        !isLoadingContacts && !contactsError
                          ? "bg-green-500"
                          : contactsError
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium">Contacts API</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {isLoadingContacts
                      ? "Đang tải..."
                      : contactsError
                      ? "Lỗi"
                      : "Kết nối thành công"}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  API Endpoint:{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    http://127.0.0.1:8000/api
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isLoadingProducts ? (
                <LoadingState message="Đang tải danh sách sản phẩm..." />
              ) : productsError ? (
                <ErrorState message={productsError} onRetry={fetchProducts} />
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  message={
                    searchQuery
                      ? "Không tìm thấy sản phẩm"
                      : "Chưa có sản phẩm nào"
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id || "new"}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.images && product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                product.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {product.status === "active"
                                ? "Hoạt động"
                                : "Tạm ngưng"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                if (!product.id) {
                                  toast.error('Sản phẩm không có ID!');
                                  return;
                                }
                                try {
                                  console.log('🔍 [Admin] Fetching product detail for ID:', product.id);
                                  const fullProduct = await getProduct(product.id);
                                  console.log('✅ [Admin] Full product loaded:', fullProduct);
                                  setEditingProduct(fullProduct);
                                  setIsProductModalOpen(true);
                                } catch (error) {
                                  console.error('❌ [Admin] Error fetching product detail:', error);
                                  toast.error('Không thể tải thông tin sản phẩm!');
                                }
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                product.id && handleDeleteProduct(product.id)
                              }
                              disabled={!product.id}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingArticle(null);
                  setIsArticleModalOpen(true);
                }}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Thêm bài viết
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isLoadingArticles ? (
                <LoadingState message="Đang tải danh sách bài viết..." />
              ) : articlesError ? (
                <ErrorState message={articlesError} onRetry={fetchArticles} />
              ) : filteredArticles.length === 0 ? (
                <EmptyState
                  message={
                    searchQuery
                      ? "Không tìm thấy bài viết"
                      : "Chưa có bài viết nào"
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tiêu đề
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Danh mục
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredArticles.map((article) => (
                        <tr
                          key={article.id || "new"}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {article.image && (
                                <img
                                  src={article.image}
                                  alt={article.title}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium text-gray-900 line-clamp-1">
                                  {article.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-1">
                                  {article.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {article.category}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                article.status === "published"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {article.status === "published"
                                ? "Đã xuất bản"
                                : "Nháp"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                if (!article.id) return;
                                try {
                                  // Fetch full article data from API
                                  const fullArticle = await getArticle(article.id);
                                  console.log('📄 [Edit] Full article from API:', fullArticle);
                                  setEditingArticle(fullArticle);
                                  setIsArticleModalOpen(true);
                                } catch (error: any) {
                                  console.error('❌ Error fetching article:', error);
                                  toast.error('Không thể tải bài viết', { description: error.message });
                                }
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                article.id && handleDeleteArticle(article.id)
                              }
                              disabled={!article.id}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm liên hệ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {isLoadingContacts ? (
                <LoadingState message="Đang tải danh sách liên hệ..." />
              ) : contactsError ? (
                <ErrorState message={contactsError} onRetry={fetchContacts} />
              ) : filteredContacts.length === 0 ? (
                <EmptyState
                  message={
                    searchQuery
                      ? "Không tìm thấy liên hệ"
                      : "Chưa có liên hệ nào"
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Khách hàng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Liên hệ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tin nhắn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">
                              {contact.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(contact.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {contact.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contact.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 line-clamp-2 max-w-md">
                              {contact.message}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                contact.status === "new"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {contact.status === "new" ? "Mới" : "Đã phản hồi"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setReplyingContact(contact);
                                setIsContactModalOpen(true);
                              }}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteContact(contact.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && <SettingsForm />}
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={async (product: Product) => {
          try {
            if (product.id) {
              // Update existing product
              await updateProduct(product.id, product);
            } else {
              // Create new product
              await createProduct(product);
            }

            await fetchProducts(); // Reload products
            setIsProductModalOpen(false);
            setEditingProduct(null);
            toast.success(
              product.id ? "Đã cập nhật sản phẩm!" : "Đã thêm sản phẩm mới!"
            );
          } catch (error: any) {
            console.error("Error submitting product:", error);
            toast.error("Lỗi khi lưu sản phẩm", { description: error.message });
            throw error;
          }
        }}
      />

      <ArticleFormModal
        isOpen={isArticleModalOpen}
        article={editingArticle}
        onClose={() => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        }}
        onSubmit={async (article: Article) => {
          try {
            let updatedArticle;

            if (article.id) {
              updatedArticle = await updateArticle(article.id, article);
            } else {
              updatedArticle = await createArticle(article);
            }

            // CẬP NHẬT LUÔN STATE LOCAL BẰNG DỮ LIỆU MỚI NHẤT TỪ API
            setArticles((prev) =>
              prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
            );

            // Nếu là tạo mới thì thêm vào danh sách
            if (!article.id) {
              setArticles((prev) => [...prev, updatedArticle]);
            }

            setIsArticleModalOpen(false);
            setEditingArticle(null);
            toast.success(
              article.id ? "Đã cập nhật bài viết!" : "Đã thêm bài viết mới!"
            );
          } catch (error: any) {
            console.error("Error submitting article:", error);
            toast.error("Lỗi khi lưu bài viết", { description: error.message });
            throw error;
          }
        }}
      />

      <ContactReplyModal
        isOpen={isContactModalOpen && replyingContact !== null}
        contact={replyingContact}
        onClose={() => {
          setIsContactModalOpen(false);
          setReplyingContact(null);
        }}
        onSubmit={async (contactId: string, reply: string) => {
          try {
            await replyContact(contactId, reply);

            await fetchContacts(); // Reload contacts
            setIsContactModalOpen(false);
            setReplyingContact(null);
            toast.success("Đã gửi phản hồi!");
          } catch (error: any) {
            console.error("Error replying to contact:", error);
            toast.error("Lỗi khi gửi phản hồi", { description: error.message });
            throw error;
          }
        }}
      />
    </div>
  );
}
