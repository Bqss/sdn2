import { axiosInstance } from "@/lib/axios";

export class PegawaiService {
  static async tambahPegawai(payload: any) {
    const result = await axiosInstance.post("/data-pegawai", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  }

  static async getPegawai() {
    const result = await axiosInstance.get("/data-pegawai");
    return result.data;
  }

  static async getPegawaiById(id: string){ 
    const result = await axiosInstance.get(`/data-pegawai/${id}`);
    return result.data;
  }
  static async updatePegawai({id, payload}: any){
    const result = await axiosInstance.put(`/data-pegawai/${id}`, payload,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  static async deletePegawai (id: string){
    const result = await axiosInstance.delete(`/data-pegawai/${id}`);
  }
}
