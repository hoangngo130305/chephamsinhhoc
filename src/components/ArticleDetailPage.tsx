import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect } from "react";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2,
  BookOpen,
  User,
  Tag
} from "lucide-react";

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

interface ArticleDetailPageAPIProps {
  article: Article;
  onBack: () => void;
}

export function ArticleDetailPageAPI({ article, onBack }: ArticleDetailPageAPIProps) {
  // Debug: log article content
  console.log('🔍 [ArticleDetailPage] Received article:', {
    id: article.id,
    title: article.title,
    content: article.content,
    contentType: typeof article.content,
  });

  // Scroll to top when component mounts - use multiple methods to ensure it works
  useLayoutEffect(() => {
    // Force scroll to top immediately
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [article]);

  useEffect(() => {
    // Additional scroll after render completes
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Multiple attempts to ensure it works
    scrollToTop();
    
    const timeout1 = setTimeout(scrollToTop, 0);
    const timeout2 = setTimeout(scrollToTop, 10);
    const timeout3 = setTimeout(scrollToTop, 50);
    const timeout4 = setTimeout(scrollToTop, 100);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      clearTimeout(timeout4);
    };
  }, [article]);

  const author = article.author || "Đội ngũ chuyên gia EBGreentek";
  const tags = article.tags || ["Sinh học", "Nông nghiệp", article.category];

  // Parse content - article.content is already parsed in convertAPIArticle
  // but we still need to handle string content for backward compatibility
  let parsedContent = article.content;

  // If content is a string, try to parse it as JSON
  if (typeof parsedContent === 'string') {
    try {
      const parsed = JSON.parse(parsedContent);
      // Check if it's structured content with intro, sections, conclusion
      if (parsed.intro !== undefined && parsed.sections && parsed.conclusion !== undefined) {
        parsedContent = parsed;
        console.log('✅ [ArticleDetailPage] Parsed structured content from JSON string');
      } else {
        console.log('⚠️ [ArticleDetailPage] Content is JSON but not in expected format');
      }
    } catch (e) {
      // Not JSON, keep as string
      console.log('📝 [ArticleDetailPage] Content is plain text');
    }
  }

  // Ensure we have structured content with proper type
  const structuredContent: {
    intro: string;
    sections: { heading: string; content: string; }[];
    conclusion: string;
  } = typeof parsedContent === 'string' 
    ? {
        intro: article.excerpt || '',
        sections: [
          {
            heading: "Nội dung chính",
            content: parsedContent
          }
        ],
        conclusion: ''
      }
    : parsedContent || {
        intro: article.excerpt || '',
        sections: [],
        conclusion: ''
      };

  console.log('📄 [ArticleDetailPage] Final structured content:', {
    intro: structuredContent.intro?.substring(0, 50) + '...',
    sectionsCount: structuredContent.sections?.length,
    sections: structuredContent.sections?.map(s => ({ heading: s.heading, contentLength: s.content?.length })),
    conclusion: structuredContent.conclusion?.substring(0, 50) + '...'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 sm:pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
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
            className="group hover:bg-blue-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay lại bài viết
          </Button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-12"
        >
          {/* Category Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full font-medium text-sm">
              {article.category}
            </span>
            {article.featured && (
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full font-medium text-sm">
                ⭐ Nổi bật
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight pb-1">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-sm sm:text-base">{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-sm sm:text-base">{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span className="text-sm sm:text-base">{article.readTime}</span>
            </div>
          </div>

          {/* Share Button */}
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-200 hover:border-blue-500 hover:bg-blue-50"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: article.title,
                  text: article.excerpt,
                }).catch(() => {
                  // Fallback: copy to clipboard
                  const url = window.location.href;
                  navigator.clipboard.writeText(`${article.title} - ${url}`);
                });
              } else {
                // Fallback for browsers that don't support Web Share API
                const url = window.location.href;
                navigator.clipboard.writeText(`${article.title} - ${url}`);
              }
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ
          </Button>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 sm:mb-12"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </motion.div>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          {/* Introduction */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-8">
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg italic">
              {structuredContent.intro}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8 sm:space-y-10">
            {structuredContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
                  {section.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Conclusion - Only show if not empty */}
          {structuredContent.conclusion && structuredContent.conclusion.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 bg-gradient-to-r from-green-50 to-blue-50 p-6 sm:p-8 rounded-2xl border border-green-100"
            >
              <div className="flex items-start gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Kết luận</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {structuredContent.conclusion}
              </p>
            </motion.div>
          )}

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.article>
      </div>
    </div>
  );
}
