import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { toast } from "sonner";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface ContactProps {
  compact?: boolean;
  onSubmit?: (data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) => Promise<any>;
}

export function Contact({ compact = false, onSubmit }: ContactProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Load settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('🔄 [Contact] Fetching settings from API...');
        const response = await fetch(`${API_BASE_URL}/settings/public/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.json();
        console.log('📥 [Contact] Received settings:', rawData);
        
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
        
        console.log('✅ [Contact] Unflattened settings:', data);
        setSettings(data);
        
        // Also save to localStorage for offline access
        localStorage.setItem("siteSettings", JSON.stringify(data));
        
      } catch (error: any) {
        console.error('❌ [Contact] Error fetching settings:', error);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem("siteSettings");
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
            console.log('⚠️ [Contact] Using localStorage fallback');
          } catch (e) {
            console.error("Error parsing localStorage settings:", e);
          }
        }
      }
    };

    fetchSettings();
    
    // Listen for settings updates from admin panel
    const handleSettingsUpdate = () => {
      console.log('🔄 [Contact] Settings updated, refetching...');
      fetchSettings();
    };
    
    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      // If onSubmit prop is provided (API), use it
      if (onSubmit) {
        await onSubmit({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'Liên hệ từ website',
          message: formData.message,
        });
      } else {
        // Fallback to localStorage
        const newContact = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          date: new Date().toLocaleDateString('vi-VN'),
          status: 'new' as const
        };

        // Get existing contacts
        const savedContacts = localStorage.getItem('adminContacts');
        let contacts = [];
        if (savedContacts) {
          try {
            contacts = JSON.parse(savedContacts);
          } catch (error) {
            console.error('Error parsing contacts:', error);
          }
        }

        // Add new contact
        contacts.unshift(newContact);
        localStorage.setItem('adminContacts', JSON.stringify(contacts));

        // Dispatch event for admin dashboard
        window.dispatchEvent(new Event('contactsUpdated'));
        
        toast.success('Gửi tin nhắn thành công!', {
          description: 'Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.'
        });
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact:', error);
      // Error is already handled by the API call with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Văn phòng chính",
      primary: settings?.general?.address?.split('\n')[0] || "123 Đường Nguyễn Văn Cừ",
      secondary: settings?.general?.address?.split('\n')[1] || "Phường 4, Quận 5, TP.HCM",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Phone,
      title: "Điện thoại",
      primary: settings?.general?.phone || "(028) 3850 1234",
      secondary: settings?.general?.hotline || "Hotline: 0901 234 567",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      primary: settings?.general?.email || "info@ebgreentek.com",
      secondary: settings?.general?.supportEmail || "support@ebgreentek.com",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      primary: settings?.general?.workingHours?.split('\n')[0] || "Thứ 2 - Thứ 6: 8:00 - 17:00",
      secondary: settings?.general?.workingHours?.split('\n')[1] || "Thứ 7: 8:00 - 12:00",
      color: "from-orange-500 to-orange-600"
    },
  ];

  return (
    <section 
      id="contact" 
      className={`${compact ? 'py-12 sm:py-16' : 'py-16 sm:py-20 lg:py-24'} bg-gradient-to-br from-gray-50 to-white relative overflow-hidden`} 
      ref={ref}
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-green-100/50 to-blue-100/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        {!compact && (
          <motion.div 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight pb-1">
              Liên Hệ
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block pb-1">
                Với Chúng Tôi
              </span>
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7
            </p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-4 sm:space-y-6">
            {compact && (
              <motion.h3 
                className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                Thông tin liên hệ
              </motion.h3>
            )}
            
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden group">
                  <CardContent className="p-4 sm:p-6 flex items-start gap-4">
                    <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${info.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{info.title}</h3>
                      <p className="text-gray-700 mb-1 text-sm sm:text-base break-words">{info.primary}</p>
                      <p className="text-gray-500 text-xs sm:text-sm break-words">{info.secondary}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                {compact && (
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Gửi tin nhắn
                  </h3>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-11 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-11 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0901 234 567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-11 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Chủ đề
                    </label>
                    <Input
                      id="subject"
                      placeholder="Hỏi về sản phẩm"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="h-11 sm:h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="min-h-[120px] sm:min-h-[150px] border-gray-200 focus:border-green-500 focus:ring-green-500 resize-none"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 h-11 sm:h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi tin nhắn
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
