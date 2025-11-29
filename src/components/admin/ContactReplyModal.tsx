import { useState } from "react";
import { Button } from "../ui/button";
import { X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  date: string;
  status: "new" | "replied";
}

interface ContactReplyModalAPIProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (contactId: string, reply: string) => Promise<void>;
  contact: Contact | null;
  apiBaseUrl?: string;
}

export function ContactReplyModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contact,
}: ContactReplyModalAPIProps) {
  const [reply, setReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact || !reply.trim()) {
      toast.error("Vui lòng nhập nội dung trả lời");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(contact.id, reply);
      setReply("");
      onClose();
    } catch (error: any) {
      console.error('Error submitting reply:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi gửi trả lời');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contact) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h2 className="text-2xl font-bold text-gray-900">Trả lời liên hệ</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-bold text-gray-900">{contact.name}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📧 {contact.email}</p>
                  <p>📱 {contact.phone}</p>
                  {contact.subject && <p>📝 Chủ đề: {contact.subject}</p>}
                  <p className="text-gray-500">📅 {contact.date}</p>
                  <p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      contact.status === 'replied' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contact.status === 'replied' ? 'Đã trả lời' : 'Mới'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Original Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tin nhắn gốc
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung trả lời *
                  </label>
                  <textarea
                    required
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                    placeholder="Nhập nội dung trả lời..."
                    disabled={isSubmitting}
                  />
                </div>

                {/* Info Note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Email sẽ được gửi đến:</strong> {contact.email}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Trả lời sẽ được lưu vào hệ thống và gửi email tự động
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi trả lời
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
