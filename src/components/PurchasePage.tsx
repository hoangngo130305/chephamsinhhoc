import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Package, 
  Shield, 
  CheckCircle2, 
  Phone,
  Star,
  Truck,
  Award,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Box
} from "lucide-react";
import { useState, useEffect, useLayoutEffect } from "react";
import { getProduct } from "../src/lib/api";
import { toast } from "sonner";

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

interface PurchasePageProps {
  product: Product;
  onBack: () => void;
}

export function PurchasePage({ product: initialProduct, onBack }: PurchasePageProps) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasGrayBg = product.name === "Biotic Aquaculture" || product.name === "Bio Aquatic" || product.name === "Biorestos" || product.name === "Pondvive 1B Aquaculture";

  // Load full product detail from API
  useEffect(() => {
    const loadProductDetail = async () => {
      // If product has ID, fetch full details
      if (initialProduct.id) {
        setIsLoading(true);
        try {
          console.log('🔍 [PurchasePage] Fetching product detail for ID:', initialProduct.id);
          const fullProduct = await getProduct(initialProduct.id);
          console.log('✅ [PurchasePage] Full product loaded:', fullProduct);
          
          // Merge with initial product data
          const mergedProduct = {
            ...initialProduct,
            ...fullProduct,
            image: fullProduct.images?.[0] || initialProduct.image,
            features: fullProduct.features || initialProduct.features || [],
            imageLabels: fullProduct.image_labels || initialProduct.imageLabels || [],
            details: {
              usage: fullProduct.usage || initialProduct.usage || initialProduct.details?.usage || "",
              ingredients: fullProduct.ingredients || initialProduct.ingredients || initialProduct.details?.ingredients || "",
              benefits: fullProduct.benefits || initialProduct.benefits || initialProduct.details?.benefits || [],
              packaging: fullProduct.packaging || initialProduct.packaging || initialProduct.details?.packaging || []
            }
          };
          
          setProduct(mergedProduct);
        } catch (error) {
          console.error('❌ [PurchasePage] Error fetching product detail:', error);
          toast.error('Không thể tải thông tin sản phẩm!');
          // Use initial product data as fallback
          setProduct({
            ...initialProduct,
            details: initialProduct.details || {
              usage: initialProduct.usage || "",
              ingredients: initialProduct.ingredients || "",
              benefits: initialProduct.benefits || [],
              packaging: initialProduct.packaging || []
            }
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        // No ID, use initial product as-is
        setProduct({
          ...initialProduct,
          details: initialProduct.details || {
            usage: initialProduct.usage || "",
            ingredients: initialProduct.ingredients || "",
            benefits: initialProduct.benefits || [],
            packaging: initialProduct.packaging || []
          }
        });
      }
    };

    loadProductDetail();
  }, [initialProduct]);

  // Scroll to top when component mounts - use multiple methods to ensure it works
  useLayoutEffect(() => {
    // Immediate scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Force scroll with requestAnimationFrame
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [initialProduct]);

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 sm:mb-8"
        >
          <Button
            variant="ghost"
            onClick={onBack}
            className="group hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại sản phẩm
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Product Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div 
                className={`relative overflow-hidden rounded-2xl shadow-2xl ${hasGrayBg ? 'bg-gray-50' : ''} ${product.images && product.images.length > 1 ? 'cursor-pointer group' : ''}`}
                onClick={() => {
                  if (product.images && product.images.length > 1) {
                    setLightboxOpen(true);
                  }
                }}
              >
                <ImageWithFallback
                  src={product.images?.[selectedImageIndex] || product.image}
                  alt={product.name}
                  className={`w-full h-96 sm:h-[450px] lg:h-[500px] ${hasGrayBg ? 'object-contain p-4 sm:p-8' : 'object-cover'} ${product.images && product.images.length > 1 ? 'group-hover:scale-[1.02] transition-transform duration-300' : ''}`}
                />
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6">
                  <span className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full font-medium text-xs sm:text-base shadow-lg">
                    {product.category}
                  </span>
                </div>

                {/* Packaging label - bottom left */}
                {product.imageLabels && product.imageLabels[selectedImageIndex] && (
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <span className="bg-white/95 text-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm shadow-lg border border-gray-200">
                      {product.imageLabels[selectedImageIndex]}
                    </span>
                  </div>
                )}

                {/* Image counter and navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <div className="absolute top-3 sm:top-6 right-3 sm:right-4 bg-black/70 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                      {selectedImageIndex + 1}/{product.images.length}
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => 
                          prev === 0 ? product.images!.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100 shadow-xl"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex((prev) => 
                          prev === product.images!.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100 shadow-xl"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </button>
                  </>
                )}
              </div>

              {/* Packaging note */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Package className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">
                    {product.images.length} hình thức đóng gói
                  </span>
                </div>
              )}

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2.5 sm:gap-3 justify-center overflow-x-auto pb-2 -mx-2 px-2">
                  {product.images.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      className={`flex-shrink-0 w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-pointer border-2 ${idx === selectedImageIndex ? 'border-green-500 shadow-lg' : 'border-gray-200'} hover:border-green-400 active:border-green-500 transition-all ${hasGrayBg ? 'bg-gray-50' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(idx);
                      }}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className={`w-full h-full ${hasGrayBg ? 'object-contain p-2 sm:p-2.5' : 'object-cover'}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-lg border border-green-100 text-center"
                >
                  <Award className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Chất lượng cao</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-lg border border-blue-100 text-center"
                >
                  <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Giao hàng nhanh</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-lg border border-green-100 text-center"
                >
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-medium text-gray-700">Hỗ trợ 24/7</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Product Details Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Product Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight pb-1">
                  {product.name}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && product.features[0] && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Đặc điểm nổi bật</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-white px-3 py-1.5 rounded-lg border border-green-100 text-gray-700 font-medium shadow-sm text-sm"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Details - Combined */}
              <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 space-y-4">
                {/* Usage */}
                {product.details?.usage && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-green-600" />
                        <h3 className="font-bold text-gray-900">Hướng dẫn sử dụng</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{product.details.usage}</p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                  </>
                )}

                {/* Ingredients */}
                {product.details?.ingredients && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <h3 className="font-bold text-gray-900">Thành phần</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{product.details.ingredients}</p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                  </>
                )}

                {/* Benefits */}
                {product.details?.benefits && product.details.benefits.length > 0 && product.details.benefits[0] && (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <h3 className="font-bold text-gray-900">Lợi ích</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {product.details.benefits.map((benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span className="text-gray-600 text-sm leading-relaxed">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* Packaging */}
                {product.details?.packaging && product.details.packaging.length > 0 && product.details.packaging[0] && (
                  <>
                    <div className="border-t border-gray-100"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4 text-purple-600" />
                        <h3 className="font-bold text-gray-900">Quy cách đóng gói</h3>
                      </div>
                      <ul className="space-y-1.5">
                        {product.details.packaging.map((pack: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span className="text-gray-600 text-sm leading-relaxed">{pack}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Contact CTA - Compact */}
              <Button
                onClick={scrollToContact}
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg text-base py-6 font-bold"
              >
                <Phone className="w-5 h-5 mr-2" />
                Liên hệ ngay
              </Button>
            </motion.div>
          </div>
        )}

        {/* Lightbox for Full Image Viewing */}
        {lightboxOpen && product.images && product.images.length > 1 && (
          <div 
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center px-2 sm:p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </button>

            <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-medium text-xs sm:text-base">
              {selectedImageIndex + 1} / {product.images.length}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => 
                  prev === 0 ? product.images!.length - 1 : prev - 1
                );
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex((prev) => 
                  prev === product.images!.length - 1 ? 0 : prev + 1
                );
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </button>

            <div className="max-w-6xl w-full flex items-center justify-center px-16 sm:px-20 py-16 sm:py-20" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <ImageWithFallback
                  src={product.images[selectedImageIndex]}
                  alt={`${product.name} - Ảnh ${selectedImageIndex + 1}`}
                  className={`max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-lg`}
                />
                {/* Packaging label - bottom left in lightbox */}
                {product.imageLabels && product.imageLabels[selectedImageIndex] && (
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <span className="bg-white/95 text-gray-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs sm:text-sm shadow-lg border border-gray-200">
                      {product.imageLabels[selectedImageIndex]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail navigation in lightbox */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 max-w-full overflow-x-auto px-2 sm:px-4 pb-1">
              {product.images.map((img: string, idx: number) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${idx === selectedImageIndex ? 'border-green-500 shadow-lg' : 'border-white/30'} hover:border-white/60 active:border-green-500 transition-colors ${hasGrayBg ? 'bg-gray-50' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(idx);
                  }}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-full h-full ${hasGrayBg ? 'object-contain p-1.5 sm:p-2' : 'object-cover'}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
