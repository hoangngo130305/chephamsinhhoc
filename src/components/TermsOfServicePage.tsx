import { Button } from "./ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface TermsOfServicePageProps {
  onBack: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  const [termsData, setTermsData] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Terms] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Terms] Received settings:', rawData);
        
        // Unflatten the grouped data structure from backend
        const data: any = {};
        
        for (const group in rawData) {
          for (const fullKey in rawData[group]) {
            const value = rawData[group][fullKey];
            
            // Split key into path
            const parts = fullKey.split('.');
            
            // Navigate/create nested structure
            let current = data;
            for (let i = 0; i < parts.length - 1; i++) {
              const part = parts[i];
              if (!current[part]) {
                current[part] = {};
              }
              current = current[part];
            }
            
            // Set the final value
            const finalKey = parts[parts.length - 1];
            
            // Try to parse JSON for arrays/objects
            try {
              current[finalKey] = JSON.parse(value);
            } catch {
              current[finalKey] = value;
            }
          }
        }
        
        console.log('✅ [Terms] Unflattened settings:', data);
        
        // Set terms data if available
        if (data.termsOfService) {
          setTermsData(data.termsOfService);
          console.log('📝 [Terms] Set termsData:', data.termsOfService);
        }
      } catch (error: any) {
        console.error('❌ [Terms] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            const settings = JSON.parse(saved);
            if (settings.termsOfService) {
              setTermsData(settings.termsOfService);
            }
            console.log('⚠️ [Terms] Using localStorage fallback');
          } catch (e) {
            console.error("Error parsing localStorage settings:", e);
          }
        }
      }
    };

    fetchSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = () => {
      console.log('🔄 [Terms] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Default data
  const defaultHero = {
    title: "Điều khoản sử dụng",
    description: "Vui lòng đọc kỹ các điều khoản trước khi sử dụng sản phẩm và dịch vụ của chúng tôi.",
    effectiveDate: "22 tháng 10, 2025"
  };

  const defaultDetailedContent = `ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ

1. Điều khoản chung
Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.

2. Quyền và trách nhiệm của khách hàng
- Cung cấp thông tin chính xác khi đăng ký
- Sử dụng sản phẩm đúng hướng dẫn
- Thanh toán đầy đủ và đúng hạn
- Không sử dụng sản phẩm vào mục đích vi phạm pháp luật

3. Quyền và trách nhiệm của EBGreentek
- Cung cấp sản phẩm chính hãng, chất lượng
- Hỗ trợ kỹ thuật và tư vấn chuyên nghiệp
- Bảo mật thông tin khách hàng
- Giải quyết khiếu nại trong thời gian sớm nhất

4. Chính sách giao hàng
- Giao hàng toàn quốc
- Thời gian: 2-5 ngày làm việc tùy khu vực
- Miễn phí vận chuyển cho đơn hàng trên 5 triệu đồng

5. Chính sách đổi trả
- Đổi trả trong vòng 7 ngày nếu sản phẩm lỗi
- Sản phẩm chưa qua sử dụng, còn nguyên bao bì
- Chi phí vận chuyển đổi trả do công ty chịu

6. Giới hạn trách nhiệm
Chúng tôi không chịu trách nhiệm cho:
- Thiệt hại do sử dụng sai hướng dẫn
- Tác động của yếu tố bên ngoài không kiểm soát được
- Thông tin sai lệch do khách hàng cung cấp

7. Liên hệ hỗ trợ
Email: contact@ebgreentek.com
Hotline: 0901 234 567
Địa chỉ: Khu công nghiệp, TP. Hồ Chí Minh, Việt Nam`;

  const defaultBottomNotice = {
    title: "Chấp nhận điều khoản",
    message: "Bằng việc sử dụng sản phẩm của EBGreentek, bạn xác nhận đã đọc và đồng ý với các điều khoản này."
  };

  // Use data from settings or defaults
  const hero = termsData?.hero || defaultHero;
  const detailedContent = termsData?.detailedContent || defaultDetailedContent;
  const bottomNotice = termsData?.bottomNotice || defaultBottomNotice;

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Diagonal Background Decorations */}
      <div className="absolute top-0 right-0 w-full h-64 sm:h-96 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-500 transform rotate-45 translate-x-16 sm:translate-x-32"></div>
          <div className="absolute top-16 left-16 right-16 h-1 sm:h-2 bg-blue-500 transform rotate-45"></div>
          <div className="absolute top-32 left-32 right-32 h-1 sm:h-2 bg-green-500 transform rotate-45"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 sm:h-96 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 transform -rotate-45 -translate-x-16 sm:-translate-x-32"></div>
          <div className="absolute top-16 left-16 right-16 h-1 sm:h-2 bg-green-500 transform -rotate-45"></div>
          <div className="absolute top-32 left-32 right-32 h-1 sm:h-2 bg-blue-500 transform -rotate-45"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="hover:bg-blue-50 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          className="max-w-3xl mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold">Terms of Service</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight pb-1">
            {hero.title}
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-3 sm:mb-4">
            {hero.description}
          </p>
          
          <p className="text-gray-500">
            Có hiệu lực từ: {hero.effectiveDate}
          </p>
        </motion.div>

        {/* Detailed Content Section */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-100 shadow-lg">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 leading-tight">
              Chi tiết điều khoản
            </h2>

            {/* Content */}
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-base text-gray-600 leading-relaxed">
                {detailedContent}
              </pre>
            </div>
          </div>
        </motion.div>

        {/* Bottom Notice */}
        <motion.div
          className="mt-8 sm:mt-12 max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl p-5 sm:p-6 lg:p-8 text-white">
            <div className="flex items-start gap-3 sm:gap-4">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-0.5 sm:mt-1" />
              <div>
                <h4 className="font-bold mb-2">{bottomNotice.title}</h4>
                <p className="text-base text-white/90 leading-relaxed">
                  {bottomNotice.message}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
