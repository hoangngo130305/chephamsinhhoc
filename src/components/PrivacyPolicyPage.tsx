import { Button } from "./ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, FileCheck, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
  const [privacyData, setPrivacyData] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Privacy] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Privacy] Received settings:', rawData);
        
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
        
        console.log('✅ [Privacy] Unflattened settings:', data);
        
        // Set privacy data if available
        if (data.privacyPolicy) {
          setPrivacyData(data.privacyPolicy);
          console.log('📝 [Privacy] Set privacyData:', data.privacyPolicy);
        }
      } catch (error: any) {
        console.error('❌ [Privacy] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            const settings = JSON.parse(saved);
            if (settings.privacyPolicy) {
              setPrivacyData(settings.privacyPolicy);
            }
            console.log('⚠️ [Privacy] Using localStorage fallback');
          } catch (e) {
            console.error("Error parsing localStorage settings:", e);
          }
        }
      }
    };

    fetchSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = () => {
      console.log('🔄 [Privacy] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Default data
  const defaultHero = {
    title: "Chính sách bảo mật",
    description: "Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng với các tiêu chuẩn bảo mật cao nhất.",
    lastUpdated: "22 tháng 10, 2025"
  };

  const defaultDetailedContent = `CHÍNH SÁCH BẢO MẬT THÔNG TIN

1. Mục đích thu thập thông tin
Chúng tôi thu thập thông tin cá nhân của bạn để:
- Cung cấp dịch vụ và sản phẩm theo yêu cầu
- Liên hệ tư vấn và hỗ trợ kỹ thuật
- Gửi thông tin về sản phẩm mới và chương trình khuyến mãi
- Cải thiện chất lượng dịch vụ

2. Phạm vi sử dụng thông tin
Thông tin cá nhân của bạn chỉ được sử dụng trong nội bộ công ty và không được chia sẻ cho bên thứ ba khi chưa có sự đồng ý của bạn.

3. Thời gian lưu trữ
Thông tin của bạn sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ. Trong mọi trường hợp, thông tin sẽ được bảo mật trên máy chủ của chúng tôi.

4. Cam kết bảo mật
- Không sử dụng, chuyển giao, cung cấp thông tin khách hàng cho bên thứ ba khi chưa có sự đồng ý
- Thông tin thanh toán được mã hóa và bảo mật tuyệt đối
- Có biện pháp kỹ thuật để ngăn chặn truy cập trái phép

5. Liên hệ
Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ:
Email: contact@ebgreentek.com
Hotline: 0901 234 567`;

  const defaultBottomNotice = {
    title: "Cam kết của chúng tôi",
    message: "EBGreentek cam kết bảo vệ thông tin của bạn với các tiêu chuẩn bảo mật cao nhất và đảm bảo an toàn tuyệt đối cho dữ liệu khách hàng."
  };

  // Use data from settings or defaults
  const hero = privacyData?.hero || defaultHero;
  const detailedContent = privacyData?.detailedContent || defaultDetailedContent;
  const bottomNotice = privacyData?.bottomNotice || defaultBottomNotice;

  const privacyItems = [
    {
      icon: Lock,
      color: "from-green-500 to-green-600",
      title: "Bảo mật thông tin",
      description: "Thông tin cá nhân được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất."
    },
    {
      icon: Eye,
      color: "from-blue-500 to-blue-600",
      title: "Minh bạch",
      description: "Chúng tôi công khai cách thức thu thập và sử dụng thông tin của bạn."
    },
    {
      icon: Database,
      color: "from-green-600 to-blue-600",
      title: "Lưu trữ an toàn",
      description: "Dữ liệu được lưu trữ trên máy chủ bảo mật với các biện pháp phòng ngừa tối ưu."
    },
    {
      icon: FileCheck,
      color: "from-blue-600 to-green-600",
      title: "Tuân thủ pháp luật",
      description: "Chính sách bảo mật tuân thủ đầy đủ các quy định pháp luật Việt Nam."
    },
    {
      icon: Users,
      color: "from-green-500 to-blue-500",
      title: "Không chia sẻ",
      description: "Chúng tôi không bao giờ chia sẻ thông tin của bạn cho bên thứ ba khi chưa có sự đồng ý."
    },
    {
      icon: Shield,
      color: "from-blue-500 to-green-500",
      title: "Cam kết bảo vệ",
      description: "Đội ngũ chuyên nghiệp giám sát và bảo vệ thông tin khách hàng 24/7."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Diagonal Background Decorations */}
      <div className="absolute top-0 right-0 w-full h-64 sm:h-96 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 transform rotate-45 translate-x-16 sm:translate-x-32"></div>
          <div className="absolute top-16 left-16 right-16 h-1 sm:h-2 bg-green-500 transform rotate-45"></div>
          <div className="absolute top-32 left-32 right-32 h-1 sm:h-2 bg-blue-500 transform rotate-45"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-64 sm:h-96 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -left-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-500 transform -rotate-45 -translate-x-16 sm:-translate-x-32"></div>
          <div className="absolute top-16 left-16 right-16 h-1 sm:h-2 bg-blue-500 transform -rotate-45"></div>
          <div className="absolute top-32 left-32 right-32 h-1 sm:h-2 bg-green-500 transform -rotate-45"></div>
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
            className="hover:bg-green-50 gap-2"
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
          <div className="inline-flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 text-sm sm:text-base">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-green-700 font-semibold">Privacy Policy</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight pb-1">
            {hero.title}
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-3 sm:mb-4">
            {hero.description}
          </p>
          
          <p className="text-gray-500">
            Cập nhật lần cuối: {hero.lastUpdated}
          </p>
        </motion.div>

        {/* Privacy Items Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl">
          {privacyItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4 sm:gap-6 group"
              >
                {/* Icon Circle */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Content Section */}
        <motion.div
          className="mt-12 sm:mt-16 lg:mt-20 max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-gray-100 shadow-lg">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-gray-900 leading-tight">
              Chi tiết chính sách
            </h2>

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
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-5 sm:p-6 lg:p-8 text-white">
            <div className="flex items-start gap-3 sm:gap-4">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-0.5 sm:mt-1" />
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
