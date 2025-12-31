import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";

export default function ClientBookDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Quay lại
            </Button>

            <h1 className="text-3xl font-bold mt-4 mb-2">Book #{id}</h1>

            <p className="text-gray-600 mb-6">
                Đây là trang chi tiết sách. Sau này sẽ gọi API lấy dữ liệu thật.
            </p>

            <Button>📥 Mượn sách</Button>
        </div>
    );
}
