import { axiosInstance } from "@/lib/axios";

export class SlideshowService {
  static async tambahSlideshow(payload: any) {
    const result = await axiosInstance.post("/slideshow", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedSlideshow({ page, perPage }: any) {
    const result = await axiosInstance.get("/slideshow", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getSlideshow() {
    const result = await axiosInstance.get("/slideshow");
    return result.data;
  }

  static async getSlideshowById(id: string) {
    const result = await axiosInstance.get(`/slideshow/${id}`);
    return result.data;
  }
  static async updateSlideshow({ id, payload }: any) {
    const result = await axiosInstance.put(`/slideshow/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async deleteSlideshow(id: string) {
    const result = await axiosInstance.delete(`/slideshow/${id}`);
  }
}
