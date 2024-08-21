import { axiosInstance } from "@/lib/axios";

export class ArsipService {
  static async tambahArsip(payload: any) {
    const result = await axiosInstance.post("/arsip-file", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedArsip({ page, perPage }: any) {
    const result = await axiosInstance.get("/arsip-file", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getArsip() {
    const result = await axiosInstance.get("/arsip-file");
    return result.data;
  }

  static async getArsipById(id: string) {
    const result = await axiosInstance.get(`/arsip-file/${id}`);
    return result.data;
  }
  static async updateArsip({ id, payload }: any) {
    const result = await axiosInstance.put(`/arsip-file/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async deleteArsip(id: string) {
    const result = await axiosInstance.delete(`/arsip-file/${id}`);
    return result.data;
  }
}
