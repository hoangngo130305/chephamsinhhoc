  import { useState, useEffect } from "react";
  import { ImageUpload } from "./ImageUpload";
  import { Button } from "../ui/button";
  import { toast } from "sonner";
  import { X, Plus, Facebook, Youtube, Instagram, Linkedin, Twitter, Github, Globe, Award, Shield, CheckCircle, BadgeCheck, Medal, Trophy, Star, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
  import { updateSettings as updateSettingsAPI, getSettingsPublic } from "../../src/lib/api";
  
  interface SocialMediaLink {
    id: string;
    platform: string;
    url: string;
    imageUrl: string;
  }
  
  interface SiteSettings {
    general: {
      siteName: string;
      logoUrl: string;
      hotline: string;
      email: string;
      supportEmail: string;
      phone: string;
      fax: string;
      address: string;
      workingHours: string;
    };
    hero: {
      title: string;
      subtitle: string;
      description: string;
      backgroundImage: string;
      bannerImage: string;
      buttonText: string;
      buttonLink: string;
    };
    socialMedia: SocialMediaLink[];
    aboutSection: {
      hero: {
        title: string;
        subtitle: string;
        description: string;
      };
      content: {
        heading: string;
        paragraph1: string;
        paragraph2: string;
      };
      features: string[];
      values: Array<{
        title: string;
        desc: string;
        color: string;
      }>;
    };
    staticPages: {
      about: string;
    };
    privacyPolicy: {
      hero: {
        title: string;
        description: string;
        lastUpdated: string;
      };
      detailedContent: string;
      bottomNotice: {
        title: string;
        message: string;
      };
    };
    termsOfService: {
      hero: {
        title: string;
        description: string;
        effectiveDate: string;
      };
      detailedContent: string;
      bottomNotice: {
        title: string;
        message: string;
      };
    };
    aboutImage: string;
    certifications: Array<{
      id: string;
      name: string;
      icon: string;
    }>;
  }
  
  export function SettingsForm() {
    const [activeSection, setActiveSection] = useState<"general" | "hero" | "social" | "pages" | "certs">("general");
    const [activePage, setActivePage] = useState<"about" | "privacy" | "terms">("about");
    
    const defaultSettings: SiteSettings = {
      general: {
        siteName: "EBGreentek",
        logoUrl: "https://example.com/logo.png",
        hotline: "0901 234 567",
        email: "info@ebgreentek.vn",
        supportEmail: "support@ebgreentek.vn",
        phone: "+84 (0)23 2000 2332",
        fax: "+84 (0)23 2002 2413",
        address: "123 Đường Nguyễn Văn Cừ\nPhường 4, Quận 5, TP.HCM",
        workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:30\nThứ 7: 8:00 - 12:00",
      },
      hero: {
        title: "Chế Phẩm Sinh Học Men Vi Sinh",
        subtitle: "Sản phẩm sinh học chất lượng cao",
        description: "Giải pháp sinh học an toàn, hiệu quả cho nông nghiệp bền vững. Được tin tưởng bởi hàng nghìn khách hàng trên toàn quốc.",
        backgroundImage: "",
        bannerImage: "",
        buttonText: "Khám phá sản phẩm",
        buttonLink: "#products",
      },
      socialMedia: [
        {
          id: "1",
          platform: "Facebook",
          url: "https://facebook.com/ebgreentek",
          imageUrl: "https://www.facebook.com/images/fb_icon_325x325.png",
        },
        {
          id: "2",
          platform: "YouTube",
          url: "https://youtube.com/@ebgreentek",
          imageUrl: "https://www.youtube.com/s/desktop/4c605598/img/favicon_32.png",
        },
      ],
      aboutSection: {
        hero: {
          title: "Đối Tác Tin Cậy Của",
          subtitle: "Nông Nghiệp Việt Nam",
          description: "Chuyên gia hàng đầu về chế phẩm sinh học men vi sinh, mang đến giải pháp bền vững cho nông nghiệp hiện đại",
        },
        content: {
          heading: "Cam kết chất lượng hàng đầu",
          paragraph1: "Với hơn một thập kỷ kinh nghiệm, chúng tôi tự hào là đơn vị tiên phong trong việc nghiên cứu và ứng dụng công nghệ sinh học tiên tiến.",
          paragraph2: "Sản phẩm được nghiên cứu và sản xuất theo tiêu chuẩn quốc tế nghiêm ngặt, đảm bảo hiệu quả tối ưu và an toàn tuyệt đối cho môi trường.",
        },
        features: [
          "Công nghệ sinh học tiên tiến từ Nhật Bản",
          "Chứng nhận ISO 9001:2015 và HACCP",
          "Đội ngũ chuyên gia giàu kinh nghiệm",
          "Hỗ trợ kỹ thuật 24/7"
        ],
        values: [
          {
            title: "Chất lượng vượt trội",
            desc: "Tiêu chuẩn quốc tế, hiệu quả đã được chứng minh",
            color: "from-green-500 to-green-600",
          },
          {
            title: "Đáng tin cậy",
            desc: "Được 500+ khách hàng tin tưởng và lựa chọn",
            color: "from-blue-500 to-blue-600",
          },
          {
            title: "Hiệu quả rõ ràng",
            desc: "Kết quả cải thiện đáng kể sau 7-14 ngày sử dụng",
            color: "from-green-600 to-blue-600",
          },
        ],
      },
      staticPages: {
        about: "Về chúng tôi...",
      },
      privacyPolicy: {
        hero: {
          title: "Chính sách bảo mật",
          description: "Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng với các tiêu chuẩn bảo mật cao nhất.",
          lastUpdated: "22 tháng 10, 2025"
        },
        detailedContent: `CHÍNH SÁCH BẢO MẬT THÔNG TIN

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
Hotline: 0901 234 567`,
        bottomNotice: {
          title: "Cam kết của chúng tôi",
          message: "EBGreentek cam kết bảo vệ thông tin của bạn với các tiêu chuẩn bảo mật cao nhất và đảm bảo an toàn tuyệt đối cho dữ liệu khách hàng."
        }
      },
      termsOfService: {
        hero: {
          title: "Điều khoản sử dụng",
          description: "Vui lòng đọc kỹ các điều khoản trước khi sử dụng sản phẩm và dịch vụ của chúng tôi.",
          effectiveDate: "22 tháng 10, 2025"
        },
        detailedContent: `ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ

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
Địa chỉ: Khu công nghiệp, TP. Hồ Chí Minh, Việt Nam`,
        bottomNotice: {
          title: "Chấp nhận điều khoản",
          message: "Bằng việc sử dụng sản phẩm của EBGreentek, bạn xác nhận đã đọc và đồng ý với các điều khoản này."
        }
      },
      aboutImage: "",
      certifications: [
        {
          id: "1",
          name: "ISO 9001:2015",
          icon: "Award",
        },
        {
          id: "2",
          name: "HACCP",
          icon: "Award",
        },
      ],
    };
  
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [newCert, setNewCert] = useState({ name: "", icon: "Award" });
    const [newSocial, setNewSocial] = useState({ platform: "", url: "", imageUrl: "" });
    
    // Loading & Error states
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    // Available icons
    const availableIcons = [
      { value: "Award", label: "Award (Giải thưởng)" },
      { value: "Shield", label: "Shield (Khiên bảo vệ)" },
      { value: "CheckCircle", label: "CheckCircle (Đã xác thực)" },
      { value: "BadgeCheck", label: "BadgeCheck (Huy hiệu)" },
      { value: "Medal", label: "Medal (Huy chương)" },
      { value: "Trophy", label: "Trophy (Cúp)" },
      { value: "Star", label: "Star (Ngôi sao)" },
    ];
  
    // Get icon component by name
    const getIconComponent = (iconName: string) => {
      const icons: Record<string, any> = {
        Award, Shield, CheckCircle, BadgeCheck, Medal, Trophy, Star,
        Facebook, Youtube, Instagram, Linkedin, Twitter, Github, Globe, Plus
      };
      return icons[iconName] || Award;
    };
  
    // ============================================================
    // API CALLS
    // ============================================================
  
    // Fetch Settings from API
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 [Settings] Fetching settings from API...');
        const rawData = await getSettingsPublic();
        console.log('📥 [Settings] Received raw data from API:', rawData);
        
        // Unflatten the data structure from backend
        // Backend returns grouped by setting_group: {"general": {"general.logo_url": "value"}}
        // Need to properly reconstruct nested structure
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
        
        console.log('🔄 [Settings] Unflattened data:', data);
        console.log('🔍 [Settings] aboutSection from API:', data.aboutSection);
        
        // Merge with defaults to ensure all fields exist
        const mergedSettings = {
          ...defaultSettings,
          ...data,
          general: {
            ...defaultSettings.general,
            ...(data.general || {})
          },
          hero: {
            ...defaultSettings.hero,
            ...(data.hero || {})
          },
          socialMedia: data.socialMedia || defaultSettings.socialMedia,
          aboutSection: {
            ...defaultSettings.aboutSection,
            ...(data.aboutSection || {}),
            hero: {
              ...defaultSettings.aboutSection.hero,
              ...(data.aboutSection?.hero || {})
            },
            content: {
              ...defaultSettings.aboutSection.content,
              ...(data.aboutSection?.content || {})
            },
            features: data.aboutSection?.features || defaultSettings.aboutSection.features,
            values: data.aboutSection?.values || defaultSettings.aboutSection.values,
          },
          staticPages: {
            ...defaultSettings.staticPages,
            ...(data.staticPages || {})
          },
          privacyPolicy: {
            ...defaultSettings.privacyPolicy,
            ...(data.privacyPolicy || {}),
            hero: {
              ...defaultSettings.privacyPolicy.hero,
              ...(data.privacyPolicy?.hero || {})
            },
            bottomNotice: {
              ...defaultSettings.privacyPolicy.bottomNotice,
              ...(data.privacyPolicy?.bottomNotice || {})
            }
          },
          termsOfService: {
            ...defaultSettings.termsOfService,
            ...(data.termsOfService || {}),
            hero: {
              ...defaultSettings.termsOfService.hero,
              ...(data.termsOfService?.hero || {})
            },
            bottomNotice: {
              ...defaultSettings.termsOfService.bottomNotice,
              ...(data.termsOfService?.bottomNotice || {})
            }
          },
          certifications: data.certifications || defaultSettings.certifications,
          aboutImage: data.aboutImage || defaultSettings.aboutImage
        };
        
        console.log('✅ [Settings] Merged aboutSection:', mergedSettings.aboutSection);
        
        setSettings(mergedSettings);
        
        // ✅ Save to localStorage for other components
        localStorage.setItem("siteSettings", JSON.stringify(mergedSettings));
        
        // ✅ Notify other components
        window.dispatchEvent(new Event("settingsUpdated"));
        
        console.log('✅ [Settings] Settings loaded from API and synced to localStorage');
      } catch (error: any) {
        console.error('❌ [Settings] Error fetching settings:', error);
        setError(error.message);
        
        // Use default settings on error
        toast.warning('Không thể tải cấu hình, sử dụng cấu hình mặc định', {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    // Save Settings to API
    const handleSave = async () => {
      try {
        setIsSaving(true);
        
        console.log('💾 [Settings] Saving settings to API...');
        
        // Save current settings before refetch (for localStorage sync)
        const settingsToSave = { ...settings };
        
        // Use API client with authentication (uses bulk_update endpoint)
        await updateSettingsAPI(settingsToSave);
        
        // ✅ REFETCH settings from server after save to ensure sync
        console.log('🔄 [Settings] Refetching settings from server...');
        await fetchSettings();
        
        // Note: fetchSettings() will trigger state update, but we need to manually
        // update localStorage because state updates are async.
        // Instead, we'll update localStorage inside fetchSettings or use a callback
        
        toast.success("Lưu cấu hình thành công!");
        console.log('✅ [Settings] Settings saved and reloaded successfully');
      } catch (error: any) {
        console.error('❌ [Settings] Error saving settings:', error);
        
        // Fallback: Save to localStorage only
        localStorage.setItem("siteSettings", JSON.stringify(settings));
        window.dispatchEvent(new Event("settingsUpdated"));
        
        toast.warning('Lưu vào bộ nhớ cục bộ thành công', {
          description: 'Không thể lưu vào server: ' + error.message
        });
      } finally {
        setIsSaving(false);
      }
    };
  
    // ============================================================
    // EFFECTS
    // ============================================================
  
    // Load settings on mount
    useEffect(() => {
      console.log('🚀 [Settings] SettingsForm_API mounted');
      fetchSettings();
    }, []);
  
    // ============================================================
    // HANDLERS
    // ============================================================
  
    const handleAddCertification = () => {
      if (!newCert.name || !newCert.icon) {
        toast.error("Vui lòng điền tên và biểu tượng chứng nhận!");
        return;
      }
  
      const cert = {
        id: Date.now().toString(),
        ...newCert,
      };
  
      setSettings({
        ...settings,
        certifications: [...settings.certifications, cert],
      });
  
      setNewCert({ name: "", icon: "Award" });
      toast.success("Thêm chứng nhận thành công!");
    };
  
    const handleDeleteCertification = (id: string) => {
      setSettings({
        ...settings,
        certifications: settings.certifications.filter((c) => c.id !== id),
      });
      toast.success("Đã xóa chứng nhận!");
    };
  
    const handleAddSocialMedia = () => {
      if (!newSocial.platform || !newSocial.url || !newSocial.imageUrl) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
        return;
      }
  
      const link = {
        id: Date.now().toString(),
        ...newSocial,
      };
  
      setSettings({
        ...settings,
        socialMedia: [...settings.socialMedia, link],
      });
  
      setNewSocial({ platform: "", url: "", imageUrl: "" });
      toast.success("Thêm liên kết mạng xã hội thành công!");
    };
  
    const handleDeleteSocialMedia = (id: string) => {
      setSettings({
        ...settings,
        socialMedia: settings.socialMedia.filter((link) => link.id !== id),
      });
      toast.success("Đã xóa liên kết mạng xã hội!");
    };
  
    const sections = [
      { id: "general", label: "Thông tin chung", icon: Globe },
      { id: "hero", label: "Banner/Hero", icon: Globe },
      { id: "social", label: "Mạng xã hội", icon: Facebook },
      { id: "pages", label: "Trang tĩnh", icon: Globe },
      { id: "certs", label: "Chứng nhận", icon: Award },
    ];
  
    // ============================================================
    // RENDER
    // ============================================================
  
    if (isLoading) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600 text-sm">Đang tải cấu hình...</p>
            <p className="text-xs text-gray-400 mt-2">Đang tải dữ liệu từ server...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Không thể tải cấu hình</p>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <Button
              onClick={fetchSettings}
              variant="outline"
              className="border-blue-200 hover:border-blue-500 hover:bg-blue-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        {/* Save Button - Fixed at top */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-900">Cấu hình website</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                API Mode
              </span>
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                'Lưu cấu hình'
              )}
            </Button>
          </div>
        </div>
  
        {/* Section Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>
  
        {/* General Settings */}
        {activeSection === "general" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin chung</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên website *
              </label>
              <input
                type="text"
                value={settings.general.siteName}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, siteName: e.target.value }
                })}
                placeholder="EBGreentek"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
  
            <ImageUpload
              value={settings.general.logoUrl}
              onChange={(value) => setSettings({
                ...settings,
                general: { ...settings.general, logoUrl: value }
              })}
              label="Logo website *"
            />
  
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hotline *
                </label>
                <input
                  type="text"
                  value={settings.general.hotline}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, hotline: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={settings.general.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, email: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ (mỗi dòng là 1 thông tin)
              </label>
              <textarea
                value={settings.general.address}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, address: e.target.value }
                })}
                rows={3}
                placeholder="123 Đường Nguyễn Văn Cừ&#10;Phường 4, Quận 5, TP.HCM"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={settings.general.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, phone: e.target.value }
                  })}
                  placeholder="+84 (0)23 2000 2332"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fax
                </label>
                <input
                  type="text"
                  value={settings.general.fax}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, fax: e.target.value }
                  })}
                  placeholder="+84 (0)23 2002 2413"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email hỗ trợ
              </label>
              <input
                type="email"
                value={settings.general.supportEmail}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, supportEmail: e.target.value }
                })}
                placeholder="support@ebgreentek.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ làm việc (mỗi dòng là 1 thông tin)
              </label>
              <textarea
                value={settings.general.workingHours}
                onChange={(e) => setSettings({
                  ...settings,
                  general: { ...settings.general, workingHours: e.target.value }
                })}
                rows={2}
                placeholder="Thứ 2 - Thứ 6: 8:00 - 17:00&#10;Thứ 7: 8:00 - 12:00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        )}
  
        {/* Hero Settings */}
        {activeSection === "hero" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cấu hình Banner/Hero</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề chính *
              </label>
              <input
                type="text"
                value={settings.hero.title}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, title: e.target.value }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                value={settings.hero.description}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, description: e.target.value }
                })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>
  
            <ImageUpload
              value={settings.hero.bannerImage}
              onChange={(value) => setSettings({
                ...settings,
                hero: { ...settings.hero, bannerImage: value }
              })}
              label="Ảnh Banner *"
            />
          </div>
        )}
  
        {/* Social Media */}
        {activeSection === "social" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mạng xã hội</h3>
            
            {/* Add New */}
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-900">Thêm liên kết mới</h4>
              
              <input
                type="text"
                value={newSocial.platform}
                onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                placeholder="Tên nền tảng (Facebook, YouTube...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
  
              <input
                type="url"
                value={newSocial.url}
                onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                placeholder="URL (https://facebook.com/...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
  
              <ImageUpload
                value={newSocial.imageUrl}
                onChange={(value) => setNewSocial({ ...newSocial, imageUrl: value })}
                label="Biểu tượng"
              />
  
              <Button
                onClick={handleAddSocialMedia}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm liên kết
              </Button>
            </div>
  
            {/* List */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Danh sách liên kết</h4>
              
              {settings.socialMedia.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có liên kết nào.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {settings.socialMedia.map((link) => (
                    <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{link.platform}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSocialMedia(link.id)}
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                      {link.imageUrl && (
                        <img
                          src={link.imageUrl}
                          alt={link.platform}
                          className="w-16 h-16 object-contain mb-2"
                        />
                      )}
                      <p className="text-sm text-gray-600 truncate">{link.url}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
  
        {/* Static Pages */}
        {activeSection === "pages" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Trang tĩnh</h3>
            
            <div className="flex gap-2 mb-4">
              {[
                { id: "about", label: "Về chúng tôi" },
                { id: "privacy", label: "Bảo mật" },
                { id: "terms", label: "Điều khoản" },
              ].map((page) => (
                <button
                  key={page.id}
                  onClick={() => setActivePage(page.id as any)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activePage === page.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page.label}
                </button>
              ))}
            </div>
  
            {activePage === "about" && (
              <div className="space-y-6">
                {/* Image Upload */}
                <ImageUpload
                  value={settings.aboutImage}
                  onChange={(value) => setSettings({
                    ...settings,
                    aboutImage: value
                  })}
                  label="Ảnh về chúng tôi"
                />
                
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                    Phần tiêu đề chính
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề dòng 1
                      </label>
                      <input
                        type="text"
                        value={settings.aboutSection.hero.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            hero: { ...settings.aboutSection.hero, title: e.target.value }
                          }
                        })}
                        placeholder="Đối Tác Tin Cậy Của"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề dòng 2
                      </label>
                      <input
                        type="text"
                        value={settings.aboutSection.hero.subtitle}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            hero: { ...settings.aboutSection.hero, subtitle: e.target.value }
                          }
                        })}
                        placeholder="Nông Nghiệp Việt Nam"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả ngắn
                      </label>
                      <textarea
                        value={settings.aboutSection.hero.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            hero: { ...settings.aboutSection.hero, description: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Chuyên gia hàng đầu về chế phẩm sinh học..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                    Phần nội dung chi tiết
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề nội dung
                      </label>
                      <input
                        type="text"
                        value={settings.aboutSection.content.heading}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            content: { ...settings.aboutSection.content, heading: e.target.value }
                          }
                        })}
                        placeholder="Cam kết chất lượng hàng đầu"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đoạn văn 1
                      </label>
                      <textarea
                        value={settings.aboutSection.content.paragraph1}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            content: { ...settings.aboutSection.content, paragraph1: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Với hơn một thập kỷ kinh nghiệm..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đoạn văn 2
                      </label>
                      <textarea
                        value={settings.aboutSection.content.paragraph2}
                        onChange={(e) => setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            content: { ...settings.aboutSection.content, paragraph2: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Sản phẩm được nghiên cứu và sản xuất..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
                    Điểm nổi bật (Features)
                  </h4>
                  
                  <div className="space-y-3">
                    {settings.aboutSection.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...settings.aboutSection.features];
                            newFeatures[index] = e.target.value;
                            setSettings({
                              ...settings,
                              aboutSection: { ...settings.aboutSection, features: newFeatures }
                            });
                          }}
                          placeholder={`Điểm nổi bật ${index + 1}`}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = settings.aboutSection.features.filter((_, i) => i !== index);
                            setSettings({
                              ...settings,
                              aboutSection: { ...settings.aboutSection, features: newFeatures }
                            });
                          }}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => {
                        setSettings({
                          ...settings,
                          aboutSection: {
                            ...settings.aboutSection,
                            features: [...settings.aboutSection.features, ""]
                          }
                        });
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Thêm điểm nổi bật
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            {activePage === "privacy" && (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                    Phần đầu (Hero)
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề chính
                      </label>
                      <input
                        type="text"
                        value={settings.privacyPolicy.hero.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacyPolicy: {
                            ...settings.privacyPolicy,
                            hero: { ...settings.privacyPolicy.hero, title: e.target.value }
                          }
                        })}
                        placeholder="Chính sách bảo mật"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả ngắn
                      </label>
                      <textarea
                        value={settings.privacyPolicy.hero.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacyPolicy: {
                            ...settings.privacyPolicy,
                            hero: { ...settings.privacyPolicy.hero, description: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Mô tả ngắn về chính sách bảo mật..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày cập nhật
                      </label>
                      <input
                        type="text"
                        value={settings.privacyPolicy.hero.lastUpdated}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacyPolicy: {
                            ...settings.privacyPolicy,
                            hero: { ...settings.privacyPolicy.hero, lastUpdated: e.target.value }
                          }
                        })}
                        placeholder="22 tháng 10, 2025"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Content Section */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                    Nội dung chi tiết
                  </h4>
                  
                  <textarea
                    value={settings.privacyPolicy.detailedContent}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacyPolicy: { ...settings.privacyPolicy, detailedContent: e.target.value }
                    })}
                    rows={15}
                    placeholder="Nội dung chi tiết chính sách bảo mật..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm"
                  />
                </div>

                {/* Bottom Notice Section */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
                    Thông báo cuối trang
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={settings.privacyPolicy.bottomNotice.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacyPolicy: {
                            ...settings.privacyPolicy,
                            bottomNotice: { ...settings.privacyPolicy.bottomNotice, title: e.target.value }
                          }
                        })}
                        placeholder="Cam kết của chúng tôi"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={settings.privacyPolicy.bottomNotice.message}
                        onChange={(e) => setSettings({
                          ...settings,
                          privacyPolicy: {
                            ...settings.privacyPolicy,
                            bottomNotice: { ...settings.privacyPolicy.bottomNotice, message: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Nội dung thông báo..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
  
            {activePage === "terms" && (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm">1</span>
                    Phần đầu (Hero)
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề chính
                      </label>
                      <input
                        type="text"
                        value={settings.termsOfService.hero.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          termsOfService: {
                            ...settings.termsOfService,
                            hero: { ...settings.termsOfService.hero, title: e.target.value }
                          }
                        })}
                        placeholder="Điều khoản sử dụng"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả ngắn
                      </label>
                      <textarea
                        value={settings.termsOfService.hero.description}
                        onChange={(e) => setSettings({
                          ...settings,
                          termsOfService: {
                            ...settings.termsOfService,
                            hero: { ...settings.termsOfService.hero, description: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Mô tả ngắn về điều khoản sử dụng..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày có hiệu lực
                      </label>
                      <input
                        type="text"
                        value={settings.termsOfService.hero.effectiveDate}
                        onChange={(e) => setSettings({
                          ...settings,
                          termsOfService: {
                            ...settings.termsOfService,
                            hero: { ...settings.termsOfService.hero, effectiveDate: e.target.value }
                          }
                        })}
                        placeholder="22 tháng 10, 2025"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Detailed Content Section */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm">2</span>
                    Nội dung chi tiết
                  </h4>
                  
                  <textarea
                    value={settings.termsOfService.detailedContent}
                    onChange={(e) => setSettings({
                      ...settings,
                      termsOfService: { ...settings.termsOfService, detailedContent: e.target.value }
                    })}
                    rows={15}
                    placeholder="Nội dung chi tiết điều khoản sử dụng..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none font-mono text-sm"
                  />
                </div>

                {/* Bottom Notice Section */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-600 text-white rounded-lg flex items-center justify-center text-sm">3</span>
                    Thông báo cuối trang
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={settings.termsOfService.bottomNotice.title}
                        onChange={(e) => setSettings({
                          ...settings,
                          termsOfService: {
                            ...settings.termsOfService,
                            bottomNotice: { ...settings.termsOfService.bottomNotice, title: e.target.value }
                          }
                        })}
                        placeholder="Chấp nhận điều khoản"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={settings.termsOfService.bottomNotice.message}
                        onChange={(e) => setSettings({
                          ...settings,
                          termsOfService: {
                            ...settings.termsOfService,
                            bottomNotice: { ...settings.termsOfService.bottomNotice, message: e.target.value }
                          }
                        })}
                        rows={3}
                        placeholder="Nội dung thông báo..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
  
        {/* Certifications */}
        {activeSection === "certs" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chứng nhận</h3>
            
            {/* Add New */}
            <div className="bg-green-50 rounded-lg p-4 space-y-4">
              <h4 className="font-medium text-gray-900">Thêm chứng nhận mới</h4>
              
              <input
                type="text"
                value={newCert.name}
                onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                placeholder="Tên chứng nhận (ISO 9001:2015...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
  
              <select
                value={newCert.icon}
                onChange={(e) => setNewCert({ ...newCert, icon: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                {availableIcons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
  
              <Button
                onClick={handleAddCertification}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm chứng nhận
              </Button>
            </div>
  
            {/* List */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Danh sách chứng nhận</h4>
              
              {settings.certifications.length === 0 ? (
                <p className="text-gray-500 text-sm">Chưa có chứng nhận nào.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {settings.certifications.map((cert) => {
                    const Icon = getIconComponent(cert.icon);
                    return (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-900">{cert.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCertification(cert.id)}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
  
        {/* Bottom Save Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu vào API...
              </>
            ) : (
              'Lưu cấu hình'
            )}
          </Button>
        </div>
      </div>
    );
  }
