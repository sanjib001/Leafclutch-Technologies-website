import axiosInstance from "../api/axios";

export interface MentorResponse {
  id: string;
  name: string;
  photo_url: string;
  specialization: string;
}

export const mentorApi = {
  // GET /admin/mentors/
  getAll: async (): Promise<MentorResponse[]> => {
    try {
      const res = await axiosInstance.get<MentorResponse[]>("/admin/mentors/");
      return res.data;
    } catch (error) {
      console.error("Mentor API Error:", error);
      return [];
    }
  },

 
  getById: async (id: string): Promise<MentorResponse> => {
    const res = await axiosInstance.get<MentorResponse>(`/admin/mentors/${id}`);
    return res.data;
  },
};