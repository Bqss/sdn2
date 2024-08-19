import { axiosInstance } from "@/lib/axios";

export class EkstrakurikulerService {
  static async tambahEkstrakurikuler(payload: any) {
    const result = await axiosInstance.post("/ekstrakurikuler", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedEkstrakurikuler({ page, perPage }: any) {
    const result = await axiosInstance.get("/ekstrakurikuler", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getEkstrakurikuler() {
    const result = await axiosInstance.get("/ekstrakurikuler");
    return result.data;
  }

  static async getEkstrakurikulerById(id: string) {
    const result = await axiosInstance.get(`/ekstrakurikuler/${id}`);
    return result.data;
  }
  static async updateEkstrakurikuler({ id, payload }: any) {
    const result = await axiosInstance.put(`/ekstrakurikuler/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async deleteEkstrakurikuler(id: string) {
    const result = await axiosInstance.delete(`/ekstrakurikuler/${id}`);
  }
}
