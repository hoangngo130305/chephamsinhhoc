import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "./ui/drawer";
import { Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createContact } from "../src/lib/api";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('📤 [ContactDialog] Submitting contact form:', formData);
      
      // Call API to create contact
      await createContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: 'Liên hệ từ website (Header)',
        message: formData.message,
      });
      
      console.log('✅ [ContactDialog] Contact submitted successfully');
      
      // Show success message
      toast.success('Gửi tin nhắn thành công!', {
        description: 'Chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Close dialog
      onOpenChange(false);
      
      // Dispatch event for admin dashboard (if on same page)
      window.dispatchEvent(new Event('contactsUpdated'));
    } catch (error: any) {
      console.error('❌ [ContactDialog] Error submitting contact:', error);
      
      // Fallback to localStorage
      console.log('⚠️ [ContactDialog] Falling back to localStorage');
      const newContact = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: 'Liên hệ từ website (Header)',
        message: formData.message,
        date: new Date().toLocaleDateString('vi-VN'),
        status: 'new' as const
      };

      // Get existing contacts
      const existingContacts = localStorage.getItem('adminContacts');
      const contacts = existingContacts ? JSON.parse(existingContacts) : [];
      
      // Add new contact
      contacts.unshift(newContact);
      
      // Save back to localStorage
      localStorage.setItem('adminContacts', JSON.stringify(contacts));
      
      // Dispatch event to notify admin dashboard
      window.dispatchEvent(new Event('contactsUpdated'));
      
      toast.warning('Lưu vào bộ nhớ cục bộ thành công', {
        description: 'Không thể kết nối đến server: ' + error.message
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Close dialog
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Họ và tên</label>
        <Input
          placeholder="Nhập họ và tên"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          disabled={isSubmitting}
          className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 h-11 bg-white"
          autoComplete="name"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
        <Input
          type="tel"
          placeholder="Nhập số điện thoại"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
          disabled={isSubmitting}
          className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 h-11 bg-white"
          autoComplete="tel"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="Nhập địa chỉ email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          disabled={isSubmitting}
          className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 h-11 bg-white"
          autoComplete="email"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Tin nhắn</label>
        <Textarea
          placeholder="Nhập tin nhắn của bạn..."
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          disabled={isSubmitting}
          className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 resize-none bg-white min-h-[80px]"
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg h-11 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh] flex flex-col">
          <DrawerTitle className="sr-only">Gửi tin nhắn cho chúng tôi</DrawerTitle>
          <DrawerDescription className="sr-only">
            Điền thông tin của bạn và gửi tin nhắn cho chúng tôi.
          </DrawerDescription>
          
          <div className="px-4 pt-2 pb-3 flex-shrink-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Gửi tin nhắn cho chúng tôi
            </h3>
          </div>
          
          <div className="px-4 pb-6 overflow-y-auto flex-1">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">Gửi tin nhắn cho chúng tôi</DialogTitle>
        <DialogDescription className="sr-only">
          Điền thông tin của bạn và gửi tin nhắn cho chúng tôi.
        </DialogDescription>
        
        <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-5">
          <h3 className="text-xl font-bold text-white">
            Gửi tin nhắn cho chúng tôi
          </h3>
        </div>

        <div className="p-6">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
}
