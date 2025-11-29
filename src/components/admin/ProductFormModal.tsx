import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ImageUpload } from "./ImageUpload";
import { toast } from "sonner";

interface Product {
  id?: string;
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
}

interface ProductFormModalAPIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => Promise<void>;
  product?: Product | null;
  apiBaseUrl?: string;
}
const API_BASE = "http://localhost:8000/api";

export function ProductFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product,
}: ProductFormModalAPIProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    category: "",
    description: "",
    features: [""],
    usage: "",
    ingredients: "",
    benefits: [""],
    packaging: [""],
    images: [""],
    image_labels: [""],
    is_popular: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data when product changes (for editing)
  useEffect(() => {
    console.log('🔄 [ProductFormModal] useEffect triggered - product:', product);
    
    if (product) {
      console.log('📦 [ProductFormModal] Raw product from props:', JSON.stringify(product, null, 2));
      
      const loadedData = {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        features: Array.isArray(product.features) && product.features.length > 0 ? product.features : [""],
        usage: product.usage || "",
        ingredients: product.ingredients || "",
        benefits: Array.isArray(product.benefits) && product.benefits.length > 0 ? product.benefits : [""],
        packaging: Array.isArray(product.packaging) && product.packaging.length > 0 ? product.packaging : [""],
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [""],
        image_labels: Array.isArray(product.image_labels) && product.image_labels.length > 0 ? product.image_labels : [""],
        is_popular: product.is_popular || false,
      };
      console.log('📝 [ProductFormModal] Processed loadedData:', JSON.stringify(loadedData, null, 2));
      setFormData(loadedData);
    } else {
      // Reset to empty form when no product (creating new)
      console.log('✨ [ProductFormModal] No product - resetting to empty form');
      setFormData({
        name: "",
        category: "",
        description: "",
        features: [""],
        usage: "",
        ingredients: "",
        benefits: [""],
        packaging: [""],
        images: [""],
        image_labels: [""],
        is_popular: false,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('🔍 [ProductForm] FormData BEFORE cleaning:', formData);
      
      // Remove empty strings from arrays, but keep text fields even if empty
      const cleanedData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ""),
        usage: formData.usage || "", // Always send usage (even if empty)
        ingredients: formData.ingredients || "", // Always send ingredients
        benefits: formData.benefits.filter(b => b.trim() !== ""), // Array can be empty
        packaging: formData.packaging.filter(p => p.trim() !== ""),
        images: formData.images.filter(img => img.trim() !== ""),
        image_labels: formData.image_labels?.filter(label => label.trim() !== ""),
      };

      console.log('📤 [ProductForm] Cleaned data AFTER filtering:', cleanedData);
      await onSubmit(cleanedData);
      onClose();
    } catch (error: any) {
      console.error('❌ [ProductForm] Error submitting product:', error);
      toast.error(error.message || 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Array handlers
  const handleArrayChange = (key: keyof Product, index: number, value: string) => {
    const array = [...(formData[key] as string[])];
    array[index] = value;
    setFormData({ ...formData, [key]: array });
  };

  const addArrayItem = (key: keyof Product) => {
    const array = [...(formData[key] as string[])];
    array.push("");
    setFormData({ ...formData, [key]: array });
  };

  const removeArrayItem = (key: keyof Product, index: number) => {
    const array = formData[key] as string[];
    if (array.length > 1) {
      const newArray = array.filter((_, i) => i !== index);
      setFormData({ ...formData, [key]: newArray });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <h2 className="text-2xl font-bold text-gray-900">
              {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
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
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục *
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ví dụ: Chăn nuôi, Thủy sản, Môi trường..."
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gợi ý: Chăn nuôi, Môi trường, Thủy sản, Phục hồi sinh học
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tính năng nổi bật
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Tính năng ${index + 1}`}
                    />
                    <Button
                      type="button"
                      onClick={() => removeArrayItem('features', index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm tính năng
                </Button>
              </div>

              {/* Usage & Ingredients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hướng dẫn sử dụng
                  </label>
                  <textarea
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành phần
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lợi ích
                </label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Lợi ích ${index + 1}`}
                    />
                    <Button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm lợi ích
                </Button>
              </div>

              {/* Packaging */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quy cách đóng gói
                </label>
                {formData.packaging.map((pkg, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={pkg}
                      onChange={(e) => handleArrayChange('packaging', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={`Ví dụ: Hộp 1kg`}
                    />
                    <Button
                      type="button"
                      onClick={() => removeArrayItem('packaging', index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem('packaging')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm quy cách
                </Button>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh sản phẩm
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="mb-4">
                    <ImageUpload
                      value={image}
                      onChange={(value) => handleArrayChange('images', index, value)}
                      label={`Hình ảnh ${index + 1}`}
                      apiBaseUrl={API_BASE}
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        variant="outline"
                        size="sm"
                        className="mt-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa ảnh này
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm ảnh
                </Button>
              </div>

              {/* Popular */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="is_popular" className="text-sm font-medium text-gray-700">
                  Sản phẩm phổ biến
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
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
                ) : product ? (
                  "Cập nhật"
                ) : (
                  "Thêm sản phẩm"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
