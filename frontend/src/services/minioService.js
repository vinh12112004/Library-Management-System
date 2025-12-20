import axios from "axios";

const MINIO_ENDPOINT = "http://localhost:9000";
const BUCKET_NAME = "library";

// Hàm lấy URL ảnh có thể truy cập được
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Nếu đã là URL đầy đủ từ MinIO
    if (imagePath.startsWith("http")) {
        // Trích xuất path từ URL
        const urlParts = imagePath.split("/library/");
        if (urlParts.length > 1) {
            return `${MINIO_ENDPOINT}/${BUCKET_NAME}/${urlParts[1]}`;
        }
        return imagePath;
    }

    // Nếu chỉ là path tương đối
    return `${MINIO_ENDPOINT}/${BUCKET_NAME}/${imagePath}`;
};

// Hàm upload ảnh lên MinIO (dành cho admin)
export const uploadImage = async (file, folder = "books") => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await axios.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.url;
    } catch (error) {
        console.error("Upload error:", error);
        throw error;
    }
};

// Hàm xóa ảnh từ MinIO
export const deleteImage = async (imagePath) => {
    try {
        await axios.delete("/api/upload", {
            data: { path: imagePath },
        });
        return true;
    } catch (error) {
        console.error("Delete error:", error);
        return false;
    }
};
