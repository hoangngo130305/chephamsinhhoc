import { Button } from "./ui/button";
import { ArrowRight, Leaf, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";
import heroBanner from "../assets/f7fb5407eeccedd33e850e514904ea87897e24c5.png";
import { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

export function Hero() {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Hero] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Hero] Received settings:', rawData);
        
        // Unflatten the grouped data structure from backend
        // Backend returns grouped by setting_group: {"general": {"general.logo_url": "value"}}
        const data: any = {};
        
        for (const group in rawData) {
          for (const fullKey in rawData[group]) {
            const value = rawData[group][fullKey];
            
            // Split key into path (e.g., "hero.title" -> ["hero", "title"])
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
        
        console.log('✅ [Hero] Unflattened settings:', data.hero);
        setSettings(data);
      } catch (error: any) {
        console.error('❌ [Hero] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
            console.log('⚠️ [Hero] Using localStorage fallback');
          } catch (e) {
            console.error("Error parsing localStorage settings:", e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = () => {
      console.log('🔄 [Hero] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Parse title to detect which part should have gradient
  const parseTitle = () => {
    const title = settings?.hero?.title;
    if (!title) {
      return {
        line1: "Chế Phẩm",
        line2: "Sinh Học",
        line3: "Men Vi Sinh"
      };
    }
    
    // Split by line breaks
    const lines = title.split('\n').map((l: string) => l.trim()).filter((l: string) => l);
    
    // If has 3+ lines, middle line gets gradient
    if (lines.length >= 3) {
      return {
        line1: lines[0],
        line2: lines[1],
        line3: lines.slice(2).join(' ')
      };
    }
    // If has 2 lines, second line gets gradient
    else if (lines.length === 2) {
      return {
        line1: lines[0],
        line2: lines[1],
        line3: null
      };
    }
    // Single line - check if contains "sinh học" to apply gradient
    else {
      const text = lines[0] || title;
      const lowerText = text.toLowerCase();
      
      // Try to find "sinh học" or similar phrases
      if (lowerText.includes('sinh học')) {
        const parts = text.split(/sinh học/i);
        return {
          line1: parts[0].trim(),
          line2: text.match(/sinh học/i)?.[0] || 'Sinh Học',
          line3: parts[1]?.trim() || null
        };
      }
      
      // Default: whole text as single line
      return {
        line1: text,
        line2: null,
        line3: null
      };
    }
  };

  const titleParts = parseTitle();

  const stats = [
    { icon: Shield, value: "100%", label: "An toàn", color: "text-green-500" },
    { icon: Award, value: "500+", label: "Khách hàng", color: "text-blue-500" },
    { icon: Leaf, value: "10+", label: "Năm kinh nghiệm", color: "text-green-600" }
  ];

  return (
    <section id="home" className="pt-20 sm:pt-24 pb-16 sm:pb-20 bg-gradient-to-br from-blue-50 via-green-50 to-white relative overflow-hidden">
      {/* Background Image if set */}
      {settings?.hero?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${settings.hero.backgroundImage})` }}
        />
      )}
      
      {/* Simple Background Elements */}
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-200/30 to-green-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div 
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-green-200/50 shadow-lg text-sm sm:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <span className="font-medium text-green-700">
                {settings?.hero?.subtitle || "Sản phẩm sinh học chất lượng cao"}
              </span>
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight pb-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gray-900">{titleParts.line1}</span><br/>
              <span className="bg-gradient-to-r from-green-600 via-blue-600 to-green-700 bg-clip-text text-transparent pb-1 inline-block">
                {titleParts.line2}
              </span><br/>
              <span className="text-gray-900">{titleParts.line3}</span>
            </motion.h1>
            
            <motion.p 
              className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {settings?.hero?.description || "Giải pháp sinh học an toàn, hiệu quả cho nông nghiệp bền vững. Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc."}
            </motion.p>

            {/* Stats - Mobile Optimized */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                      <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons - Mobile Optimized */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                asChild
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8"
              >
                <a href={settings?.hero?.buttonLink || "#products"}>
                  {settings?.hero?.buttonText || "Khám phá sản phẩm"}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-2 border-green-500/20 hover:border-green-500 hover:bg-green-50 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8"
              >
                <a href="#contact">Tư vấn miễn phí</a>
              </Button>
            </motion.div>
          </div>

          {/* Image - Mobile Optimized */}
          <motion.div 
            className="relative mt-8 lg:mt-0 order-first lg:order-last"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl transform rotate-6"></div>
            
            <motion.div 
              className="relative bg-white/80 backdrop-blur-sm p-2 sm:p-3 lg:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={settings?.hero?.bannerImage || heroBanner}
                alt="Chế phẩm sinh học EBGreentek"
                className="w-full h-48 sm:h-64 lg:h-80 object-cover object-bottom rounded-xl sm:rounded-2xl shadow-lg"
              />
              
              {/* Floating badges - Mobile Optimized */}
              <motion.div 
                className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-green-100"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Chất lượng cao</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-3 border border-blue-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700">An toàn 100%</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
