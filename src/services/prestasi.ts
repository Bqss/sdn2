import { axiosInstance } from "@/lib/axios";

export class PrestasiService {
  static async tambahPrestasi(payload: any) {
    const result = await axiosInstance.post("/prestasi", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async paginatedPrestasi({ page, perPage }: any) {
    const result = await axiosInstance.get("/prestasi", {
      params: {
        page,
        size: perPage,
      },
    });
    return result.data;
  }

  static async getPrestasi() {
    const result = await axiosInstance.get("/prestasi");
    return result.data;
  }

  static async getPrestasiById(id: string) {
    const result = await axiosInstance.get(`/prestasi/${id}`);
    return result.data;
  }
  static async updatePrestasi({ id, payload }: any) {
    const result = await axiosInstance.put(`/prestasi/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async deletePrestasi(id: string) {
    const result = await axiosInstance.delete(`/prestasi/${id}`);
  }
}
