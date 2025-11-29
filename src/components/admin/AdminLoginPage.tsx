import { useState } from "react";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { Lock, User, LogIn, Shield } from "lucide-react";
import { toast } from "sonner";
import { login } from "../../src/lib/api";

interface AdminLoginPageProps {
  onLogin: () => void;
  onBack?: () => void;
}

export function AdminLoginPage({ onLogin, onBack }: AdminLoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(username, password);
      localStorage.setItem('adminAuth', 'true');
      toast.success("Đăng nhập thành công!");
      onLogin();
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error("Lỗi khi đăng nhập", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Quản trị viên
            </h1>
            <p className="text-gray-600">Đăng nhập vào hệ thống quản lý</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Đang đăng nhập...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Đăng nhập
                </span>
              )}
            </Button>
          </form>

          {/* Demo Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
          </motion.div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          {onBack ? (
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Quay lại trang chủ
            </button>
          ) : (
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Quay lại trang chủ
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}