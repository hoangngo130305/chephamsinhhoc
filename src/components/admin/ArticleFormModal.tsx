import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";

interface ArticleSection {
  heading: string;
  content: string;
}

interface ArticleContent {
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
}

interface Article {
  id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string | ArticleContent;
  author: string;
  image: string;
  tags?: string[];
  status: "published" | "draft";
  is_featured?: boolean;
  read_time?: string;
}

interface ArticleFormModalAPIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (article: Article) => Promise<void>;
  article?: Article | null;
  apiBaseUrl?: string;
}

const API_BASE_URL = "http://localhost:8000/api";

export function ArticleFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  article,
}: ArticleFormModalAPIProps) {
  // Basic info state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState<string[]>([""]);
  const [status, setStatus] = useState<"published" | "draft">("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [readTime, setReadTime] = useState("5 phút đọc");

  // Structured content state
  const [intro, setIntro] = useState("");
  const [sections, setSections] = useState<ArticleSection[]>([
    { heading: "", content: "" }
  ]);
  const [conclusion, setConclusion] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Thủy sản", "Chăn nuôi", "Môi trường", "Nông nghiệp"];

  // Parse article data when editing
  useEffect(() => {
    if (isOpen) {
      if (article) {
        console.log('📝 [ArticleFormModal] Loading article for edit:', article);
        
        setTitle(article.title || "");
        setCategory(article.category || "");
        setExcerpt(article.excerpt || "");
        setAuthor(article.author || "Admin");
        setImage(article.image || "");
        setTags(article.tags?.length ? article.tags : [""]);
        setStatus(article.status as "published" | "draft");
        setIsFeatured(article.is_featured || false);
        setReadTime(article.read_time || "5 phút đọc");

        // Parse content
        if (article.content) {
          try {
            let parsedContent: ArticleContent;
            
            // Try parse as JSON string first
            if (typeof article.content === 'string') {
              try {
                parsedContent = JSON.parse(article.content);
              } catch (e) {
                // Not JSON, treat as plain text - use default structure
                parsedContent = {
                  intro: article.excerpt || "",
                  sections: [{ heading: "Nội dung chính", content: article.content }],
                  conclusion: ""
                };
              }
            } else {
              parsedContent = article.content;
            }

            // Validate structure
            if (parsedContent.intro !== undefined && parsedContent.sections && parsedContent.conclusion !== undefined) {
              setIntro(parsedContent.intro);
              setSections(parsedContent.sections.length > 0 ? parsedContent.sections : [{ heading: "", content: "" }]);
              setConclusion(parsedContent.conclusion);
              console.log('✅ Parsed structured content:', parsedContent);
            } else {
              // Invalid structure, use defaults
              setIntro("");
              setSections([{ heading: "", content: "" }]);
              setConclusion("");
            }
          } catch (e) {
            console.error('❌ Error parsing content:', e);
            setIntro("");
            setSections([{ heading: "", content: "" }]);
            setConclusion("");
          }
        }
      } else {
        // New article - reset all fields
        setTitle("");
        setCategory("");
        setExcerpt("");
        setAuthor("Admin");
        setImage("");
        setTags([""]);
        setStatus("draft");
        setIsFeatured(false);
        setReadTime("5 phút đọc");
        setIntro("");
        setSections([{ heading: "", content: "" }]);
        setConclusion("");
      }
    }
  }, [article, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build structured content
      const structuredContent: ArticleContent = {
        intro,
        sections: sections.filter(s => s.heading.trim() || s.content.trim()),
        conclusion
      };

      // Serialize to JSON string for backend
      const contentString = JSON.stringify(structuredContent);

      // Clean tags
      const cleanedTags = tags.filter(tag => tag.trim() !== "");

      const articleData: Article = {
        ...(article?.id && { id: article.id }),
        title,
        category,
        excerpt,
        content: contentString,
        author,
        image,
        tags: cleanedTags,
        status,
        is_featured: isFeatured,
        read_time: readTime,
      };

      console.log('📤 [ArticleFormModal] Submitting article:', {
        id: articleData.id,
        title: articleData.title,
        status: articleData.status,
        contentLength: contentString.length,
        structuredContent,
      });

      await onSubmit(articleData);
      onClose();
    } catch (error: any) {
      console.error('❌ [ArticleFormModal] Error submitting article:', error);
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section handlers
  const handleSectionChange = (index: number, field: 'heading' | 'content', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { heading: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((_, i) => i !== index));
    }
  };

  // Tags handlers
  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 sticky top-0 z-10 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              {article ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6">
              {/* BASIC INFO SECTION */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                
                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    placeholder="Nhập tiêu đề bài viết..."
                  />
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tác giả *
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tóm tắt ngắn gọn *
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    required
                    placeholder="Tóm tắt ngắn gọn về nội dung bài viết (hiển thị trong danh sách bài viết)..."
                  />
                </div>

                {/* Image */}
                <div>
                  <ImageUpload
                    value={image}
                    onChange={(value) => setImage(value)}
                    label="Hình ảnh bài viết *"
                    apiBaseUrl={API_BASE_URL}
                  />
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="border-2 border-green-200 p-4 rounded-lg bg-green-50/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">
                    Nội dung bài viết
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Bài viết được chia thành 3 phần: Giới thiệu → Các phần nội dung chính → Kết luận
                </p>

                {/* 1. INTRO */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">1</span>
                      Phần giới thiệu *
                    </span>
                  </label>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-blue-50/50"
                    rows={4}
                    required
                    placeholder="Viết phần giới thiệu cho bài viết. Đây sẽ hiển thị trong khung màu xanh ở đầu bài..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Phần này sẽ hiển thị trong khung nổi bật màu xanh ở đầu trang chi tiết
                  </p>
                </div>

                {/* 2. SECTIONS */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">2</span>
                      Các phần nội dung chính *
                    </span>
                  </label>
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Phần {index + 1}
                          </span>
                          {sections.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removeSection(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 h-8"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <input
                          type="text"
                          value={section.heading}
                          onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3 font-medium"
                          placeholder={`Tiêu đề phần ${index + 1} (VD: Lợi ích chính, Cách thức hoạt động, Hướng dẫn sử dụng...)`}
                          required
                        />
                        
                        <textarea
                          value={section.content}
                          onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows={5}
                          placeholder={`Nội dung chi tiết cho phần "${section.heading || (index + 1)}"...`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    type="button"
                    onClick={addSection}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-green-300 text-green-700 hover:bg-green-50 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm phần nội dung
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Mỗi phần sẽ hiển thị với tiêu đề lớn và icon thanh màu xanh bên trái
                  </p>
                </div>

                {/* 3. CONCLUSION */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline-flex items-center gap-2">
                      <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">3</span>
                      Kết luận *
                    </span>
                  </label>
                  <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-orange-50/50"
                    rows={4}
                    required
                    placeholder="Viết phần kết luận cho bài viết. Tóm tắt lại nội dung và đưa ra lời khuyên, định hướng..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Phần kết luận giúp tóm tắt và đưa ra định hướng cuối cùng
                  </p>
                </div>
              </div>

              {/* METADATA SECTION */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin bổ sung</h3>

                {/* Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (từ khóa)
                  </label>
                  {tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tag}
                        onChange={(e) => handleTagChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Tag ${index + 1}`}
                      />
                      {tags.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTag(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tag
                  </Button>
                </div>

                {/* Read Time & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian đọc
                    </label>
                    <input
                      type="text"
                      value={readTime}
                      onChange={(e) => setReadTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="VD: 5 phút đọc"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái *
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="published">Xuất bản</option>
                    </select>
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                    ⭐ Bài viết nổi bật
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : article ? (
                  "Cập nhật bài viết"
                ) : (
                  "Thêm bài viết"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
