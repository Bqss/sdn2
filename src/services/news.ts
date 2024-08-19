import { axiosInstance } from "@/lib/axios";

export class NewsService {
  static async tambahBerita(payload: any) {
    const result = await axiosInstance.post("/news", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedBerita({ page, perPage }: any) {
    const result = await axiosInstance.get("/news", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getNews() {
    const result = await axiosInstance.get("/news");
    return result.data;
  }

  static async getNewsById(id: string) {
    const result = await axiosInstance.get(`/news/${id}`);
    return result.data;
  }
  static async updateNews({ id, payload }: any) {
    const result = await axiosInstance.put(`/news/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async deleteNews(id: string) {
    const result = await axiosInstance.delete(`/news/${id}`);
  }
}
