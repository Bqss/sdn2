import { axiosInstance } from "@/lib/axios";

export class GalleryService {
  static async tambahBerita(payload: any) {
    const result = await axiosInstance.post("/gallery", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedGallery({ page, perPage }: any) {
    const result = await axiosInstance.get("/gallery", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getGallery() {
    const result = await axiosInstance.get("/gallery");
    return result.data;
  }

  static async getGalleryById(id: string) {
    const result = await axiosInstance.get(`/gallery/${id}`);
    return result.data;
  }
  static async updateGallery({ id, payload }: any) {
    const result = await axiosInstance.put(`/gallery/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async deleteGallery(id: string) {
    const result = await axiosInstance.delete(`/gallery/${id}`);
  }
}
