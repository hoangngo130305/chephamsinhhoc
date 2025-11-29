import { CheckCircle2, TrendingUp, Leaf, Users, Globe, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Benefits() {
  const benefits = [
    {
      icon: Leaf,
      title: "100% Tự nhiên",
      description: "Sản phẩm từ vi sinh vật có lợi, không hóa chất độc hại"
    },
    {
      icon: TrendingUp,
      title: "Hiệu quả cao",
      description: "Tăng năng suất 15-30%, giảm chi phí nuôi trồng"
    },
    {
      icon: Users,
      title: "Dễ sử dụng",
      description: "Hướng dẫn chi tiết, hỗ trợ kỹ thuật 24/7"
    },
    {
      icon: Globe,
      title: "Thân thiện môi trường",
      description: "Không gây ô nhiễm, phát triển bền vững"
    },
    {
      icon: Award,
      title: "Chứng nhận chất lượng",
      description: "Đạt tiêu chuẩn quốc gia và quốc tế"
    },
    {
      icon: CheckCircle2,
      title: "Kiểm định nghiêm ngặt",
      description: "Quy trình kiểm tra chất lượng đa cấp"
    }
  ];

  const applications = [
    {
      title: "Nuôi trồng thủy sản",
      description: "Cải thiện chất lượng nước, tăng sức đề kháng",
      stats: "+25% năng suất",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop"
    },
    {
      title: "Chăn nuôi gia súc", 
      description: "Tăng cường tiêu hóa, giảm bệnh tật",
      stats: "-40% chi phí thuốc",
      image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=300&h=200&fit=crop"
    },
    {
      title: "Xử lý môi trường",
      description: "Phân hủy chất thải, cải thiện nước và đất",
      stats: "-60% mùi hôi",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tại Sao Chọn Chế Phẩm Sinh Học?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những lợi ích vượt trội cho nông nghiệp hiện đại
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Applications */}
        <div className="bg-green-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Ứng Dụng Thực Tế
            </h3>
            <p className="text-gray-600">
              Được ứng dụng thành công trong nhiều lĩnh vực
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {applications.map((app, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <ImageWithFallback
                  src={app.image}
                  alt={app.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h4 className="font-bold text-gray-900 mb-2">{app.title}</h4>
                <p className="text-gray-600 mb-4">{app.description}</p>
                <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                  {app.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}