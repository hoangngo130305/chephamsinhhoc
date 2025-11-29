import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Users, Target, CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface ValueItem {
  icon: any;
  title: string;
  desc: string;
  color: string;
}

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [aboutImage, setAboutImage] = useState<string>("https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600");
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [About] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [About] Received settings:', rawData);
        
        // Unflatten the grouped data structure from backend
        // Backend returns grouped by setting_group: {"general": {"general.logo_url": "value"}}
        const data: any = {};
        
        for (const group in rawData) {
          for (const fullKey in rawData[group]) {
            const value = rawData[group][fullKey];
            
            // Split key into path (e.g., "aboutSection.hero.title" -> ["aboutSection", "hero", "title"])
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
        
        console.log('✅ [About] Unflattened settings:', data);
        console.log('🔍 [About] aboutSection data:', data.aboutSection);
        
        // Set about image if available (handle both aboutImage and about_image)
        if (data.aboutImage || data.about_image) {
          setAboutImage(data.aboutImage || data.about_image);
          console.log('🖼️ [About] Set aboutImage:', data.aboutImage || data.about_image);
        }
        
        // Set about data if available (handle both aboutSection and about_section)
        if (data.aboutSection || data.about_section) {
          const aboutSectionData = data.aboutSection || data.about_section;
          setAboutData(aboutSectionData);
          console.log('📝 [About] Set aboutData:', aboutSectionData);
        }
      } catch (error: any) {
        console.error('❌ [About] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            const settings = JSON.parse(saved);
            if (settings.aboutImage) {
              setAboutImage(settings.aboutImage);
            }
            if (settings.aboutSection) {
              setAboutData(settings.aboutSection);
            }
            console.log('⚠️ [About] Using localStorage fallback');
          } catch (e) {
            console.error("Error parsing localStorage settings:", e);
          }
        }
      }
    };

    fetchSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = () => {
      console.log('🔄 [About] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Default data
  const defaultHero = {
    title: "Đối Tác Tin Cậy Của",
    subtitle: "Nông Nghiệp Việt Nam",
    description: "Chuyên gia hàng đầu về chế phẩm sinh học men vi sinh, mang đến giải pháp bền vững cho nông nghiệp hiện đại"
  };

  const defaultContent = {
    heading: "Cam kết chất lượng hàng đầu",
    paragraph1: "Với hơn một thập kỷ kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc nghiên cứu và ứng dụng công nghệ sinh học tiên tiến.",
    paragraph2: "Sản phẩm được nghiên cứu và sản xuất theo tiêu chuẩn quốc tế nghiêm ngặt, đảm bảo hiệu quả tối ưu và an toàn tuyệt đối cho môi trường."
  };

  const defaultFeatures = [
    "Công nghệ sinh học tiên tiến từ Nhật Bản",
    "Chứng nhận ISO 9001:2015 và HACCP",
    "Đội ngũ chuyên gia giàu kinh nghiệm",
    "Hỗ trợ kỹ thuật 24/7"
  ];

  const defaultValues: ValueItem[] = [
    { 
      icon: Award, 
      title: "Chất lượng vượt trội", 
      desc: "Tiêu chuẩn quốc tế, hiệu quả đã được chứng minh",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: Users, 
      title: "Đáng tin cậy", 
      desc: "Được 500+ khách hàng tin tưởng và lựa chọn",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: Target, 
      title: "Hiệu quả rõ ràng", 
      desc: "Kết quả cải thiện đáng kể sau 7-14 ngày sử dụng",
      color: "from-green-600 to-blue-600"
    }
  ];

  // Use data from settings or defaults
  const hero = aboutData?.hero || defaultHero;
  const content = aboutData?.content || defaultContent;
  const features = aboutData?.features || defaultFeatures;
  const valuesData = aboutData?.values || defaultValues;
  
  console.log('🎯 [About] Using hero:', hero);
  console.log('🎯 [About] Using content:', content);
  console.log('🎯 [About] Using features:', features);

  // Map icons for values
  const values = valuesData.map((val: any, idx: number) => ({
    ...val,
    icon: [Award, Users, Target][idx] || Award
  }));

  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden" ref={ref}>
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 sm:w-64 h-48 sm:h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative">
        <motion.div 
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >


          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight pb-1">
            {hero.title}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block pb-1">
              {hero.subtitle}
            </span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            {hero.description}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-12 sm:mb-16 lg:mb-20">
          <motion.div 
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{content.heading}</h3>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                {content.paragraph1}
              </p>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                {content.paragraph2}
              </p>
            </div>

            {/* Features List */}
            <ul className="space-y-4">
              {features.filter((f: string) => f.trim()).map((feature: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.6 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-200/50 to-blue-200/50 rounded-2xl sm:rounded-3xl blur-2xl transform -rotate-6"></div>
            
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <ImageWithFallback
                src={aboutImage}
                alt="Đối tác nông nghiệp Việt Nam"
                className="w-full h-auto object-cover rounded-2xl sm:rounded-3xl shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Values - Mobile Optimized - Only show first 3 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.slice(0, 3).map((item: ValueItem, index: number) => {
            const IconComponent = item.icon;
            return (
              <motion.div 
                key={index} 
                className="group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <motion.div 
                  className="text-center p-6 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${item.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </motion.div>
                  
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{item.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{item.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}