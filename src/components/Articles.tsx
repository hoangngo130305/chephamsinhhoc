import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

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

interface ArticlesAPIProps {
  articles: Article[];
  onReadArticle?: (article: Article) => void;
}

export function Articles({ articles, onReadArticle }: ArticlesAPIProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Hiển thị 3 bài một lần
  const articlesPerPage = 3;
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const displayedArticles = articles.slice(
    currentPage * articlesPerPage,
    (currentPage + 1) * articlesPerPage
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    setHoveredIndex(null);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    setHoveredIndex(null);
  };

  // Get the currently displayed article for the left side
  // Ưu tiên: hoveredIndex > selectedArticle > displayedArticles[0]
  const displayedArticle = hoveredIndex !== null 
    ? displayedArticles[hoveredIndex] 
    : selectedArticle || displayedArticles[0];

  // If no articles, show empty state
  if (!articles || articles.length === 0) {
    return (
      <section id="articles" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden" ref={ref}>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight pb-1">
              Bài Viết
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block pb-1">
                Chuyên Ngành
              </span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Chưa có bài viết nào được xuất bản
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Header - Center Aligned */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight pb-1">
            Bài Viết
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block pb-1">
              Chuyên Ngành
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
            Cập nhật kiến thức mới nhất về công nghệ sinh học và ứng dụng thực tiễn
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column - Content */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={displayedArticle.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col justify-center"
              >
                <div className="mb-4 sm:mb-6">
                  <span className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium">
                    {displayedArticle.category}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  {displayedArticle.title}
                </h3>

                <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed line-clamp-4">
                  {displayedArticle.excerpt}
                </p>

                <div className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    {displayedArticle.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    {displayedArticle.readTime}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      if (onReadArticle) {
                        onReadArticle(displayedArticle);
                      }
                    }}
                  >
                    Đọc bài viết
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>

                  {displayedArticle.author && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Tác giả:</span> {displayedArticle.author}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right Column - Images in Curved Layout */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 relative">
              {displayedArticles.map((article, index) => {
                // Tạo đường cong: ảnh giữa cao hơn, 2 ảnh bên thấp hơn
                const curveOffset = index === 1 ? '-20px' : '40px';
                
                return (
                  <motion.div
                    key={`${currentPage}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative group cursor-pointer"
                    style={{ 
                      transform: `translateY(${curveOffset})`,
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={() => {
                      setHoveredIndex(index);
                      setSelectedArticle(article);
                    }}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (onReadArticle) {
                        onReadArticle(article);
                      }
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                      <div className="aspect-[3/4]">
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      
                      {/* Overlay on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-green-600/80 via-blue-600/60 to-transparent transition-opacity duration-300 ${
                        hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                          <h4 className="text-xs sm:text-sm font-bold line-clamp-2 mb-1">
                            {article.title}
                          </h4>
                          <p className="text-xs opacity-90">{article.category}</p>
                        </div>
                      </div>

                      {/* Active indicator */}
                      {hoveredIndex === index && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full shadow-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Navigation Arrows */}
            {articles.length > articlesPerPage && (
              <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevPage}
                  className="rounded-full border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentPage(index);
                        setHoveredIndex(null);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentPage === index 
                          ? 'bg-gradient-to-r from-green-600 to-blue-600 w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextPage}
                  className="rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
