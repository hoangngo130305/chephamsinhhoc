import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

interface ImageUploadAPIProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  apiBaseUrl?: string;
}
const API_BASE_URL = "http://127.0.0.1:8000/api";

export function ImageUpload({ 
  value, 
  onChange, 
  label = "Hình ảnh",
}: ImageUploadAPIProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Chưa đăng nhập");
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      console.log('📤 Uploading image to API:', `${API_BASE_URL}/upload-image/`);

      const response = await fetch(`${API_BASE_URL}/upload-image/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Get image URL from response
      const imageUrl = data.url || data.image_url || data.file_url;
      
      if (!imageUrl) {
        throw new Error('Không nhận được URL ảnh từ server');
      }

      console.log('✅ Image uploaded:', imageUrl);
      onChange(imageUrl);
      toast.success("Upload ảnh thành công!");
    } catch (error: any) {
      console.error('❌ Upload error:', error);
      
      // Fallback to base64 if API upload fails
      console.log('⚠️ API upload failed, using base64 fallback');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        toast.warning("Upload API thất bại, dùng base64 thay thế");
      };
      reader.onerror = () => {
        toast.error("Có lỗi khi xử lý ảnh!");
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveImage = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast.success("Đã xóa ảnh!");
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {value ? (
        /* Image Preview */
        <div className="relative">
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
            <img
              src={value}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          </div>
          <Button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
            size="sm"
            disabled={isUploading}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>Ảnh đã được chọn</span>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isUploading
              ? "border-blue-500 bg-blue-50 cursor-wait"
              : isDragging
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center gap-3">
            {isUploading ? (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <p className="text-gray-900 font-medium">
                  Đang upload lên server...
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng đợi
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <p className="text-gray-900 font-medium mb-1">
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF, WEBP (Tối đa 5MB)
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Ảnh sẽ được upload lên server
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Chọn ảnh
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
