import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContactDialog } from "./ContactDialog";
import defaultLogo from "../assets/93b714c497399529c7b2e062679af59386de7a40.png";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface HeaderProps {
  onLogoClick?: () => void;
  isOnPurchasePage?: boolean;
}

export function Header({ onLogoClick, isOnPurchasePage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Header] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Header] Received settings:', rawData);
        
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
        
        console.log('✅ [Header] Unflattened settings:', data);
        setSettings(data);
      } catch (error: any) {
        console.error('❌ [Header] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
            console.log('⚠️ [Header] Using localStorage fallback');
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
      console.log('🔄 [Header] Settings updated, refetching...');
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

  // Handle navigation click - if on purchase page, go home first then scroll
  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    
    if (isOnPurchasePage) {
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

  const navItems = [
    { href: "#home", label: "Trang chủ" },
    { href: "#about", label: "Giới thiệu" },
    { href: "#products", label: "Sản phẩm" },
    { href: "#articles", label: "Tin tức" },
    { href: "#contact", label: "Liên hệ" }
  ];

  return (
    <motion.header 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-xl' 
          : 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={onLogoClick}
          >
            <img src={logo} alt={siteName} className="h-12 sm:h-16 w-auto" />
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            {navItems.map((item, index) => (
              <motion.button 
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-green-600 transition-colors duration-200 relative group font-medium text-base lg:text-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </motion.button>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:block"
          >
            <Button 
              onClick={() => setIsContactDialogOpen(true)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-base lg:text-lg px-5 lg:px-7"
            >
              Liên hệ ngay
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden hover:bg-green-50 w-10 h-10 p-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gray-100 rounded-full scale-110"></div>
                  <X className="w-6 h-6 relative z-10" style={{ color: '#000000', strokeWidth: 3 }} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-800 stroke-[2.5]" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Mobile Menu */}
              <motion.nav 
                className="absolute left-4 right-4 top-full mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-20 md:hidden overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="space-y-4">
                    {navItems.map((item, index) => (
                      <motion.button 
                        key={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className="block w-full text-left text-gray-700 hover:text-green-600 transition-colors font-medium py-3 px-4 rounded-xl hover:bg-green-50 text-base"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {item.label}
                      </motion.button>
                    ))}
                    
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4 border-t border-gray-100"
                    >
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg text-base py-3"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsContactDialogOpen(true);
                        }}
                      >
                        Liên hệ ngay
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
      
      {/* Contact Dialog */}
      <ContactDialog 
        open={isContactDialogOpen} 
        onOpenChange={setIsContactDialogOpen} 
      />
    </motion.header>
  );
}
