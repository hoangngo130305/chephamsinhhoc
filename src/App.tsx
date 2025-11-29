import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Articles as Articles } from "./components/Articles";
import { Footer } from "./components/Footer";
import { PurchasePage } from "./components/PurchasePage";
import { ArticleDetailPageAPI as ArticleDetailPage } from "./components/ArticleDetailPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import { AdminLoginPage } from "./components/admin/AdminLoginPage";
import { AdminDashboard as AdminDashboard } from "./components/admin/AdminDashboard";
import { Toaster } from "./components/ui/sonner";
import { Products } from "./components/Products";
import { Contact as Contact } from "./components/Contact";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button";

// ============================================================
// TYPES & INTERFACES
// ============================================================
interface Product {
  id?: string;
  name: string;
  category: string;
  description: string;
  price?: string;
  unit?: string;
  image: string;
  images?: string[];
  imageLabels?: string[];
  image_labels?: string[];
  rating?: number;
  popular?: boolean;
  is_popular?: boolean;
  features?: string[];
  usage?: string;
  ingredients?: string;
  benefits?: string[];
  packaging?: string[];
  status?: string;
  details?: {
    usage: string;
    ingredients: string;
    benefits: string[];
    packaging?: string[];
  };
}

interface Article {
  id?: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  content?: string | {
    intro: string;
    sections: {
      heading: string;
      content: string;
    }[];
    conclusion: string;
  };
  author?: string;
  tags?: string[];
}

interface APIProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  usage: string;
  ingredients: string;
  benefits: string[];
  packaging: string[];
  images: string[];
  image_labels: string[];
  status: string;
  is_popular: boolean;
  sort_order: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface APIArticle {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  status: string;
  is_featured: boolean;
  view_count: number;
  read_time: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// API CONFIGURATION
// ============================================================
const API_BASE = "http://localhost:8000/api";

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Convert API product to frontend format
function convertAPIProduct(apiProduct: APIProduct): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    category: apiProduct.category,
    description: apiProduct.description,
    price: "Liên hệ",
    unit: "",
    image: apiProduct.images?.[0] || "",
    rating: 4.8,
    popular: apiProduct.is_popular,
    features: apiProduct.features || [],
    details: {
      usage: apiProduct.usage || "",
      ingredients: apiProduct.ingredients || "",
      benefits: apiProduct.benefits || [],
    },
    images: apiProduct.images || [],
    imageLabels: apiProduct.image_labels || [],
    packaging: apiProduct.packaging || [],
  };
}

// Convert API article to frontend format
function convertAPIArticle(apiArticle: APIArticle): Article {
  console.log('🔄 [convertAPIArticle] Processing article:', {
    id: apiArticle.id,
    title: apiArticle.title,
    contentType: typeof apiArticle.content,
    contentPreview: apiArticle.content?.substring(0, 100)
  });

  // Try to parse content as structured JSON first
  let content: string | {
    intro: string;
    sections: { heading: string; content: string; }[];
    conclusion: string;
  };

  try {
    const parsed = JSON.parse(apiArticle.content);
    console.log('🔍 [convertAPIArticle] Parsed JSON:', {
      hasIntro: parsed.intro !== undefined,
      hasSections: !!parsed.sections,
      hasConclusion: parsed.conclusion !== undefined,
      sectionsCount: parsed.sections?.length
    });
    
    // Check if it's structured content
    if (parsed.intro !== undefined && parsed.sections && parsed.conclusion !== undefined) {
      content = parsed;
      console.log('✅ [convertAPIArticle] Using structured content with', parsed.sections.length, 'sections');
    } else {
      // Not structured, keep as string
      content = apiArticle.content;
      console.log('⚠️ [convertAPIArticle] Content is JSON but not in expected structure, keeping as string');
    }
  } catch (e) {
    // Not JSON, keep as string
    content = apiArticle.content;
    console.log('📝 [convertAPIArticle] Content is not JSON, keeping as string');
  }

  return {
    id: apiArticle.id,
    title: apiArticle.title,
    excerpt: apiArticle.excerpt,
    date: new Date(apiArticle.published_at || apiArticle.created_at).toLocaleDateString('vi-VN'),
    readTime: apiArticle.read_time || "5 phút đọc",
    category: apiArticle.category,
    image: apiArticle.image,
    featured: apiArticle.is_featured,
    content: content,
    author: apiArticle.author || "Admin",
    tags: apiArticle.tags || [],
  };
}

// ============================================================
// MAIN APP COMPONENT WITH FULL API INTEGRATION
// ============================================================
export default function AppWithAPI() {
  const [currentView, setCurrentView] = useState<'home' | 'purchase' | 'article' | 'privacy' | 'terms' | 'admin'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  // API State
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);

  // ============================================================
  // API CALLS
  // ============================================================
  
  // Fetch Articles from API
  const fetchArticles = async () => {
    try {
      setIsLoadingArticles(true);
      setArticlesError(null);
      
      console.log('🔄 Fetching articles from API...');
      const response = await fetch(`${API_BASE}/articles/?status=published`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle both paginated and non-paginated responses
      const articlesData = data.results || data;
      
      if (!Array.isArray(articlesData)) {
        throw new Error('Invalid articles data format');
      }
      
      const convertedArticles = articlesData.map(convertAPIArticle);
      setArticles(convertedArticles);
      
      console.log('✅ Articles loaded from API:', convertedArticles.length);
      
      if (convertedArticles.length === 0) {
        toast.info('Chưa có bài viết nào');
      }
    } catch (error: any) {
      console.error('❌ Error fetching articles:', error);
      setArticlesError(error.message);
      setArticles([]);
      
      toast.error('Không thể tải bài viết từ API', {
        description: error.message
      });
    } finally {
      setIsLoadingArticles(false);
    }
  };

  // Submit Contact Form to API
  const submitContact = async (contactData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    try {
      console.log('📤 Submitting contact form to API...');
      
      const response = await fetch(`${API_BASE}/contacts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Contact submitted successfully:', data.id);
      
      toast.success('Gửi liên hệ thành công!', {
        description: 'Chúng tôi sẽ phản hồi sớm nhất có thể.'
      });
      
      return data;
    } catch (error: any) {
      console.error('❌ Error submitting contact:', error);
      toast.error('Không thể gửi liên hệ', {
        description: error.message
      });
      throw error;
    }
  };

  // Fetch Public Settings from API
  const fetchSettings = async () => {
    try {
      console.log('🔄 Fetching settings from API...');
      
      const response = await fetch(`${API_BASE}/settings/public/`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Settings loaded from API');
      
      // Store settings in localStorage for components
      localStorage.setItem('siteSettings', JSON.stringify(data));
      
      // Dispatch event for components listening
      window.dispatchEvent(new Event('settingsUpdated'));
      
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching settings:', error);
      // Settings are optional, don't show error toast
      return null;
    }
  };

  // ============================================================
  // EFFECTS
  // ============================================================
  
  // Load data on mount
  useEffect(() => {
    console.log('🚀 AppWithAPI mounted - Loading data from API...');
    console.log('📡 API Base URL:', API_BASE);
    
    fetchArticles();
    fetchSettings();
  }, []);

  // Check admin authentication on mount
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth") === "true";
    const hasToken = localStorage.getItem("adminToken");
    
    // User is authenticated only if both auth flag and token exist
    const isAuthenticated = Boolean(isAuth && hasToken);
    setIsAdminAuthenticated(isAuthenticated);
    
    // If auth flag exists but no token, clear auth flag
    if (isAuth && !hasToken) {
      console.warn('⚠️ adminAuth exists but no token - clearing auth');
      localStorage.removeItem('adminAuth');
    }
    
    // Check URL for admin route
    if (window.location.pathname === "/admin") {
      setCurrentView("admin");
    }
  }, []);

  // Enable smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    
    return () => clearTimeout(timeoutId);
  }, [currentView]);

  // ============================================================
  // HANDLERS
  // ============================================================
  
  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('purchase');
  };

  const handleReadArticle = (article: Article) => {
    console.log('📖 [handleReadArticle] Opening article:', {
      id: article.id,
      title: article.title,
      content: article.content,
      contentType: typeof article.content,
    });
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClickFromFooter = async (productName: string) => {
    try {
      // Fetch all products and find the matching one
      const response = await fetch(`${API_BASE}/products/?status=active`);
      if (!response.ok) {
        throw new Error('Không thể tải danh sách sản phẩm');
      }
      const data = await response.json();
      const productsData = data.results || data;
      const convertedProducts = productsData.map(convertAPIProduct);
      const product = convertedProducts.find((p: Product) => p.name === productName);
      
      if (product) {
        handlePurchase(product);
      } else {
        toast.error('Sản phẩm không tồn tại');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải sản phẩm');
    }
  };

  const handlePrivacyClick = () => {
    setCurrentView('privacy');
  };

  const handleTermsClick = () => {
    setCurrentView('terms');
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  // ============================================================
  // LOADING COMPONENT
  // ============================================================
  const LoadingSection = ({ message }: { message: string }) => (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
          <p className="text-gray-600 text-center">{message}</p>
          <p className="text-sm text-gray-400 mt-2">API: {API_BASE}</p>
        </div>
      </div>
    </section>
  );

  // ============================================================
  // ERROR COMPONENT
  // ============================================================
  const ErrorSection = ({ 
    message, 
    onRetry 
  }: { 
    message: string; 
    onRetry: () => void;
  }) => (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Không thể tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Kiểm tra backend đang chạy tại: {API_BASE}
          </p>
        </div>
      </div>
    </section>
  );

  // ============================================================
  // EMPTY STATE COMPONENT
  // ============================================================
  const EmptySection = ({ 
    title, 
    description 
  }: { 
    title: string; 
    description: string;
  }) => (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </section>
  );

  // ============================================================
  // RENDER
  // ============================================================
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {currentView !== 'admin' && (
        <Header 
          onLogoClick={handleBackToHome} 
          isOnPurchasePage={currentView === 'purchase' || currentView === 'article' || currentView === 'privacy' || currentView === 'terms'} 
        />
      )}
      
      {/* Main Content */}
      {currentView === 'home' ? (
        <main className="relative">
          <Hero />
          <About />
          
          {/* Products Section with API */}
          <Products 
            onPurchase={handlePurchase} 
          />
          
          {/* Articles Section with API */}
          {isLoadingArticles ? (
            <LoadingSection message="Đang tải bài viết từ API..." />
          ) : articlesError ? (
            <ErrorSection 
              message={articlesError} 
              onRetry={fetchArticles}
            />
          ) : articles.length > 0 ? (
            <Articles 
              onReadArticle={handleReadArticle} 
              articles={articles}
            />
          ) : (
            <EmptySection 
              title="Chưa có bài viết"
              description="Hiện tại chưa có bài viết nào được xuất bản."
            />
          )}
          
          {/* Contact with API submission */}
          <Contact onSubmit={submitContact} />
        </main>
      ) : currentView === 'purchase' && selectedProduct ? (
        <main key={`purchase-${selectedProduct.name}`} className="relative">
          <PurchasePage product={selectedProduct} onBack={handleBackToHome} />
          <Contact compact onSubmit={submitContact} />
        </main>
      ) : currentView === 'article' && selectedArticle ? (
        <main key={`article-${selectedArticle.title}`} className="relative">
          <ArticleDetailPage article={selectedArticle} onBack={handleBackToHome} />
          <Contact compact onSubmit={submitContact} />
        </main>
      ) : currentView === 'privacy' ? (
        <main key="privacy" className="relative">
          <PrivacyPolicyPage onBack={handleBackToHome} />
        </main>
      ) : currentView === 'terms' ? (
        <main key="terms" className="relative">
          <TermsOfServicePage onBack={handleBackToHome} />
        </main>
      ) : currentView === 'admin' ? (
        <main key="admin" className="relative">
          {isAdminAuthenticated ? (
            <AdminDashboard 
              onLogout={() => {
                // Clear all auth data
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminRefreshToken');
                setIsAdminAuthenticated(false);
                setCurrentView('home');
                console.log('👋 Logged out - all tokens cleared');
                // Refresh data after admin changes
                fetchArticles();
                fetchSettings();
              }} 
            />
          ) : (
            <AdminLoginPage 
              onLogin={() => setIsAdminAuthenticated(true)} 
              onBack={() => setCurrentView('home')}
            />
          )}
        </main>
      ) : null}
      
      {/* Footer */}
      {currentView !== 'admin' && (
        <Footer 
          onProductClick={handleProductClickFromFooter}
          onPrivacyClick={handlePrivacyClick}
          onTermsClick={handleTermsClick}
          onAdminClick={handleAdminClick}
          onLogoClick={handleBackToHome}
          isOnOtherPage={currentView !== 'home'}
        />
      )}
      
      {/* Toaster */}
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            maxWidth: '90vw',
          },
          className: 'text-sm sm:text-base',
        }}
      />
    </div>
  );
}

// Missing import for Package icon
import { Package } from "lucide-react";
