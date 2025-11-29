import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, ShoppingCart, Info, CheckCircle2, Package, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { getProducts, getProduct } from "../src/lib/api";

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

interface ProductsProps {
  onPurchase?: (product: Product) => void;
}

export function Products({ onPurchase }: ProductsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        console.log('🔄 [Products] Fetching products from API...');
        const response = await getProducts();
        console.log('✅ [Products] API response:', response);
        
        // Handle both paginated and non-paginated responses
        const apiProducts = response.results || response;
        
        if (!Array.isArray(apiProducts)) {
          console.error('❌ [Products] API response is not an array:', apiProducts);
          throw new Error('Invalid API response format');
        }
        
        // Filter active products only
        const activeProducts = apiProducts
          .filter((p: any) => p.status !== "inactive")
          .map((p: any) => ({
            ...p,
            image: p.images?.[0] || p.image || "",
            price: "Liên hệ",
            unit: "",
            rating: 4.8,
            popular: p.is_popular || false,
            features: p.features || [],
            details: {
              usage: p.usage || "",
              ingredients: p.ingredients || "",
              benefits: p.benefits || [],
              packaging: p.packaging || []
            }
          }));
        
        setProducts(activeProducts);
        console.log('✅ [Products] Products set:', activeProducts.length);
      } catch (error) {
        console.error('❌ [Products] Error loading products:', error);
        toast.error('Không thể tải sản phẩm từ server');
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Reset image index when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedProduct]);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Handle opening product detail modal
  const handleOpenProductDetail = async (index: number) => {
    const product = products[index];
    
    // If product doesn't have ID, just open with existing data
    if (!product.id) {
      setSelectedProduct(index);
      setSelectedProductDetail(product);
      return;
    }

    // Fetch full product detail from API
    setIsLoadingDetail(true);
    try {
      console.log('🔍 [Products] Fetching product detail for ID:', product.id);
      const fullProduct = await getProduct(product.id);
      console.log('✅ [Products] Full product loaded:', fullProduct);
      
      // Merge with existing product data
      const mergedProduct = {
        ...product,
        ...fullProduct,
        image: fullProduct.images?.[0] || product.image,
        features: fullProduct.features || product.features || [],
        details: {
          usage: fullProduct.usage || "",
          ingredients: fullProduct.ingredients || "",
          benefits: fullProduct.benefits || [],
          packaging: fullProduct.packaging || []
        },
        imageLabels: fullProduct.image_labels || product.imageLabels || []
      };
      
      setSelectedProductDetail(mergedProduct);
      setSelectedProduct(index);
    } catch (error) {
      console.error('❌ [Products] Error fetching product detail:', error);
      toast.error('Không thể tải thông tin sản phẩm!');
      // Fallback to existing product data
      setSelectedProductDetail(product);
      setSelectedProduct(index);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <section id="products" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" ref={ref}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight pb-1">
            Bộ Sản Phẩm
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block pb-1">
              Chế Phẩm Sinh Học
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Bốn dòng sản phẩm chính được nghiên cứu chuyên sâu cho từng lĩnh vực ứng dụng
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải sản phẩm...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">Chưa có sản phẩm nào.</p>
          </div>
        ) : (
          <>
            {/* Products Grid - Mobile Optimized */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {currentProducts.map((product, index) => {
            const actualIndex = startIndex + index; // Get actual index in full products array
            return (
              <motion.div
                key={product.id || actualIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm h-full">
                  <div className="relative overflow-hidden">
                    {product.popular && (
                      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                        🔥 Phổ biến
                      </div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50"
                    >
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-40 sm:h-48 lg:h-56 object-contain p-2"
                      />
                    </motion.div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
                    <div className="mb-2">
                      <span className="text-xs sm:text-sm bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-2 sm:px-3 py-1 rounded-full font-medium">
                        {product.category}
                      </span>
                    </div>
                    <CardTitle className="text-lg sm:text-xl text-gray-900 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-3">{product.description}</p>
                  </CardHeader>

                  <CardContent className="pt-0 p-4 sm:p-6">
                    {/* Features */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {product.features && product.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions - Mobile Optimized */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-green-200 hover:border-green-500 hover:bg-green-50"
                        onClick={() => handleOpenProductDetail(actualIndex)}
                        disabled={isLoadingDetail}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Chi tiết
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => {
                          if (onPurchase) {
                            onPurchase(product);
                          }
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Mua
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8">
                <Button
                  variant="outline"
                  className="mr-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  className="ml-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}



        {/* Product Detail Dialog - Mobile Optimized */}
        <Dialog open={selectedProduct !== null} onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
            setSelectedProductDetail(null);
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedProduct !== null && selectedProductDetail && (
              <>
                <DialogHeader className="pr-8 sm:pr-6 px-4 sm:px-0 pt-4 sm:pt-0">
                  <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent pb-1">
                    {selectedProductDetail.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    {selectedProductDetail.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
                  {/* Product Image Gallery */}
                  <div className="space-y-3">
                    <div 
                      className="relative bg-gray-50 group rounded-lg sm:rounded-xl overflow-hidden"
                    >
                      <ImageWithFallback
                        src={selectedProductDetail.images?.[selectedImageIndex] || selectedProductDetail.image}
                        alt={selectedProductDetail.name}
                        className="w-full h-56 sm:h-64 object-contain p-2 sm:p-3"
                      />
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-medium text-xs sm:text-sm shadow-md">
                          {selectedProductDetail.category}
                        </span>
                      </div>
                      
                      {/* Image label - bottom left */}
                      {selectedProductDetail.imageLabels && selectedProductDetail.imageLabels[selectedImageIndex] && (
                        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                          <span className="bg-white/95 text-gray-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs sm:text-sm shadow-lg border border-gray-200">
                            {selectedProductDetail.imageLabels[selectedImageIndex]}
                          </span>
                        </div>
                      )}
                      
                      {/* Image counter and navigation */}
                      {selectedProductDetail.images && selectedProductDetail.images.length > 1 && (
                        <>
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                            {selectedImageIndex + 1}/{selectedProductDetail.images.length}
                          </div>
                          
                          {/* Navigation arrows - visible on mobile touch */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex((prev) => 
                                prev === 0 ? selectedProductDetail.images!.length - 1 : prev - 1
                              );
                            }}
                            className="absolute left-1.5 sm:left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100 shadow-lg"
                          >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex((prev) => 
                                prev === selectedProductDetail.images!.length - 1 ? 0 : prev + 1
                              );
                            }}
                            className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 active:bg-black/90 flex items-center justify-center transition-all sm:opacity-0 sm:group-hover:opacity-100 shadow-lg"
                          >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* Packaging note */}
                    {selectedProductDetail.images && selectedProductDetail.images.length > 1 && (
                      <div className="flex items-center justify-center gap-2 text-gray-600 py-1">
                        <Package className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">
                          {selectedProductDetail.images.length} hình thức đóng gói
                        </span>
                      </div>
                    )}
                    
                    {/* Thumbnails */}
                    {selectedProductDetail.images && selectedProductDetail.images.length > 1 && (
                      <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                        {selectedProductDetail.images.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className={`flex-shrink-0 w-[70px] h-[70px] sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${idx === selectedImageIndex ? 'border-green-500 shadow-md' : 'border-gray-200'} hover:border-green-400 active:border-green-500 transition-colors bg-gray-50`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImageIndex(idx);
                            }}
                          >
                            <ImageWithFallback
                              src={img}
                              alt={`${selectedProductDetail.name} ${idx + 1}`}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {selectedProductDetail.features && selectedProductDetail.features.length > 0 && selectedProductDetail.features[0] && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Tính năng nổi bật</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProductDetail.features.map((feature: string, idx: number) => (
                          <span key={idx} className="text-xs sm:text-sm bg-gradient-to-r from-green-50 to-blue-50 text-gray-700 px-3 py-1.5 rounded-lg border border-green-100">
                            ✓ {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Usage */}
                  {selectedProductDetail.details?.usage && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Hướng dẫn sử dụng</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedProductDetail.details.usage}</p>
                    </div>
                  )}

                  {/* Ingredients */}
                  {selectedProductDetail.details?.ingredients && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Thành phần</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{selectedProductDetail.details.ingredients}</p>
                    </div>
                  )}

                  {/* Benefits */}
                  {selectedProductDetail.details?.benefits && selectedProductDetail.details.benefits.length > 0 && selectedProductDetail.details.benefits[0] && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Lợi ích</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedProductDetail.details.benefits.map((benefit: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                            <span className="text-gray-600 text-sm sm:text-base">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Packaging */}
                  {selectedProductDetail.details?.packaging && selectedProductDetail.details.packaging.length > 0 && selectedProductDetail.details.packaging[0] && (
                    <div>
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Quy cách đóng gói</h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedProductDetail.details.packaging.map((pack: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span className="text-gray-600 text-sm sm:text-base">{pack}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 sm:pt-4 pb-4 sm:pb-0 border-t">
                    <Button 
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg h-11 sm:h-12"
                      onClick={() => {
                        if (onPurchase && selectedProduct !== null) {
                          onPurchase(selectedProductDetail);
                          setSelectedProduct(null);
                          setSelectedProductDetail(null);
                        }
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>


      </div>
    </section>
  );
}
