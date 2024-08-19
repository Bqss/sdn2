import { axiosInstance } from "@/lib/axios";

export class ProfileService {
  static async updateProfile(payload: any) {
    const result = await axiosInstance.post("/profile-sekolah", payload);
    return result.data;
  }

  static async getProfile() {
    const result = await axiosInstance.get("/profile-sekolah");
    return result.data;
  }
}
