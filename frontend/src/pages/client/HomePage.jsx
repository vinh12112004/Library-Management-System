import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Bộ sưu tập phong phú",
            description: "Hàng ngàn đầu sách từ nhiều thể loại khác nhau",
        },
        {
            icon: <Search className="w-8 h-8" />,
            title: "Tìm kiếm dễ dàng",
            description: "Công cụ tìm kiếm mạnh mẽ và chính xác",
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Xu hướng mới nhất",
            description: "Cập nhật liên tục những đầu sách hot nhất",
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Cộng đồng đọc giả",
            description: "Kết nối với hàng nghìn người yêu sách",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        ✨ Nền tảng thư viện số hiện đại
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Chào mừng đến Thư viện
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Khám phá thế giới tri thức với hàng ngàn đầu sách chất
                        lượng cao. Đọc sách chưa bao giờ dễ dàng và thú vị đến
                        thế!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            onClick={() => navigate("/books")}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Khám phá ngay
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate("/about")}
                            className="px-8 py-6 text-lg rounded-lg border-2 hover:bg-gray-50 transition-all duration-300"
                        >
                            Tìm hiểu thêm
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                            10,000+
                        </div>
                        <div className="text-gray-600">Đầu sách</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                            50,000+
                        </div>
                        <div className="text-gray-600">Độc giả</div>
                    </div>
                    <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl font-bold text-pink-600 mb-2">
                            100+
                        </div>
                        <div className="text-gray-600">Thể loại</div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-24">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Tại sao chọn chúng tôi?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="text-blue-600 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bắt đầu hành trình đọc sách của bạn
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Tham gia cùng hàng nghìn độc giả khác ngay hôm nay
                    </p>
                    <Button
                        onClick={() => navigate("/books")}
                        className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Xem danh sách sách
                    </Button>
                </div>
            </div>
        </div>
    );
}
