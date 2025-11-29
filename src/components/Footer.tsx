import { Button } from "./ui/button";
import { MapPin, Phone, Mail, Facebook, Youtube, Linkedin, ArrowRight, Award, Shield, Star, CheckCircle, BadgeCheck, Medal, Trophy, Instagram, Twitter, Github, Globe, Plus } from "lucide-react";
import defaultLogo from "../assets/93b714c497399529c7b2e062679af59386de7a40.png";
import { useState, useEffect } from "react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface FooterProps {
  onProductClick?: (productName: string) => void;
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
  onLogoClick?: () => void;
  isOnOtherPage?: boolean;
  onAdminClick?: () => void;
}

interface Certification {
  id: string;
  name: string;
  icon: string;
}

export function Footer({ onProductClick, onPrivacyClick, onTermsClick, onLogoClick, isOnOtherPage = false, onAdminClick }: FooterProps) {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Footer] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Footer] Received settings:', rawData);
        
        // Unflatten the grouped data structure from backend
        // Backend returns grouped by setting_group: {"general": {"general.logo_url": "value"}}
        const data: any = {};
        
        for (const group in rawData) {
          for (const fullKey in rawData[group]) {
            const value = rawData[group][fullKey];
            
            // Split key into path (e.g., "general.logo_url" -> ["general", "logo_url"])
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
        
        console.log('✅ [Footer] Unflattened settings:', data);
        setSettings(data);
      } catch (error: any) {
        console.error('❌ [Footer] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
            console.log('⚠️ [Footer] Using localStorage fallback');
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
      console.log('🔄 [Footer] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  // Handle both camelCase and snake_case from backend
  const logo = settings?.general?.logoUrl || settings?.general?.logo_url || defaultLogo;
  const siteName = settings?.general?.siteName || settings?.general?.site_name || "EBGreentek";

  const handleProductClick = (productName: string) => {
    if (onProductClick) {
      onProductClick(productName);
    } else {
      // Fallback to scroll to products section
      const productsSection = document.querySelector('#products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleNavClick = (href: string) => {
    if (isOnOtherPage) {
      // Go back to home first, then scroll
      if (onLogoClick) {
        onLogoClick();
        // Wait for page transition then scroll
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } else {
      // Normal scroll on same page
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Get icon component by name
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Award, Shield, CheckCircle, BadgeCheck, Medal, Trophy, Star,
      Facebook, Youtube, Instagram, Linkedin, Twitter, Github, Globe, Plus
    };
    return icons[iconName] || Award;
  };

  // Get social icon color class
  const getSocialIconColor = (iconName: string) => {
    const colors: Record<string, string> = {
      Facebook: "hover:bg-blue-600",
      Youtube: "hover:bg-red-600",
      Instagram: "hover:bg-pink-600",
      Linkedin: "hover:bg-blue-700",
      Twitter: "hover:bg-sky-500",
      Github: "hover:bg-gray-700",
      Globe: "hover:bg-green-600",
      Plus: "hover:bg-purple-600"
    };
    return colors[iconName] || "hover:bg-gray-600";
  };

  // Get icon colors for certifications
  const getIconColor = (index: number) => {
    const colors = ["text-yellow-400", "text-green-400", "text-blue-400", "text-purple-400", "text-red-400", "text-pink-400"];
    return colors[index % colors.length];
  };

  // Get certifications from settings or use defaults
  const certifications: Certification[] = settings?.certifications?.length > 0 
    ? settings.certifications 
    : [
        { id: "1", name: "ISO 9001:2015", icon: "Award" },
        { id: "2", name: "HACCP", icon: "Shield" },
        { id: "3", name: "FDA", icon: "Star" }
      ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-green-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Main Footer */}
      <div className="py-16 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt={siteName} className="h-24 sm:h-32 w-auto" />
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed text-lg">
                Đối tác tin cậy trong lĩnh vực chế phẩm sinh học men vi sinh, 
                mang đến giải pháp bền vững cho nông nghiệp Việt Nam.
              </p>
              
              {/* Certifications */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white mb-3">Chứng nhận chất lượng</h4>
                <div className="grid grid-cols-3 gap-3">
                  {certifications.map((cert, index) => {
                    const IconComponent = getIconComponent(cert.icon);
                    return (
                      <div key={cert.id} className="flex flex-col items-center gap-2 text-center">
                        <IconComponent className={`w-5 h-5 ${getIconColor(index)}`} />
                        <span className="text-xs text-gray-300">{cert.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-bold mb-6 text-lg">Kết nối với chúng tôi</h4>
              <div className="flex flex-col gap-3 pl-4">
                {Array.isArray(settings?.socialMedia) && settings.socialMedia.length > 0 ? (
                  settings.socialMedia.map((link: any) => {
                    return (
                      <a 
                        key={link.id}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group w-fit font-medium"
                      >
                        {link.imageUrl ? (
                          <img 
                            src={link.imageUrl} 
                            alt={link.platform}
                            className="w-5 h-5 object-contain"
                          />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )}
                        <span>{link.platform}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })
                ) : (
                  /* Fallback for old format or empty */
                  <>
                    <a 
                      href="https://facebook.com/ebgreentek" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group w-fit font-medium"
                    >
                      <Facebook className="w-5 h-5" />
                      <span>Facebook</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <a 
                      href="https://youtube.com/@ebgreentek" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors group w-fit font-medium"
                    >
                      <Youtube className="w-5 h-5" />
                      <span>YouTube</span>
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-6 text-lg">Liên kết</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => handleNavClick('#about')}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Về chúng tôi</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavClick('#products')}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Sản phẩm</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavClick('#articles')}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Tin tức</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavClick('#contact')}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Liên hệ</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onPrivacyClick}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Chính sách bảo mật</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onTermsClick}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Điều khoản sử dụng</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onAdminClick}
                    className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-2 group font-medium"
                  >
                    <span>Quản trị viên</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-6 text-lg">Liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white mb-1">
                      {settings?.general?.address?.split('\n')[0] || "123 Đường Nguyễn Văn Cừ"}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {settings?.general?.address?.split('\n')[1] || "Phường 4, Quận 5, TP.HCM"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {settings?.general?.phone || "+84 (0)23 2000 2332"}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Fax: {settings?.general?.fax || "+84 (0)23 2002 2413"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {settings?.general?.email || "info@ebgreentek.vn"}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {settings?.general?.supportEmail || "support@ebgreentek.vn"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © 2025 EBGreentek. All rights reserved. Thiết kế bởi EBGreentek Team.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span>Made with ❤️ in Vietnam</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 đánh giá từ khách hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
