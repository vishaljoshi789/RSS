import { AxiosInstance } from "axios";
import {
  Wing,
  Level,
  Designation,
  Volunteer,
  PaginatedResponse,
  WingFormData,
  LevelFormData,
  DesignationFormData,
  VolunteerFormData,
  VolunteerFilters,
  User,
  UserListResponse,
  Application,
  ApplicationFormData,
  ApplicationFilters,
} from "../types";

export class VolunteerAPI {
  constructor(private axios: AxiosInstance) {}

  async getWings(): Promise<Wing[]> {
    const response = await this.axios.get("/volunteer/wings/");
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  }

  async getWing(id: number): Promise<Wing> {
    const response = await this.axios.get<Wing>(`/volunteer/wings/${id}/`);
    return response.data;
  }

  async createWing(data: WingFormData): Promise<Wing> {
    const response = await this.axios.post<Wing>("/volunteer/wings/", data);
    return response.data;
  }

  async updateWing(id: number, data: Partial<WingFormData>): Promise<Wing> {
    const response = await this.axios.patch<Wing>(
      `/volunteer/wings/${id}/`,
      data
    );
    return response.data;
  }

  async deleteWing(id: number): Promise<void> {
    await this.axios.delete(`/volunteer/wings/${id}/`);
  }

  async getLevels(wingName?: string): Promise<Level[]> {
    const params: any = {};
    if (wingName !== undefined && wingName !== null) params.wings = wingName;
    const response = await this.axios.get("/volunteer/levels/", { params });
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  }

  async getLevel(id: number): Promise<Level> {
    const response = await this.axios.get<Level>(`/volunteer/levels/${id}/`);
    return response.data;
  }

  async createLevel(data: LevelFormData): Promise<Level> {
    const payload: any = {
      wing: data.wing,
      level: Array.isArray(data.name)
        ? data.name.map((n: any) =>
            typeof n === "string" ? n : n?.en ?? String(n)
          )
        : [String(data.name as any)],
    };

    const response = await this.axios.post<Level>(
      "/volunteer/levels/",
      payload
    );
    return response.data;
  }

  async updateLevel(id: number, data: Partial<LevelFormData>): Promise<Level> {
    let payload: any = { ...data };
    if (data.name) {
      payload = {
        ...payload,
        level: Array.isArray(data.name)
          ? data.name.map((n: any) =>
              typeof n === "string" ? n : n?.en ?? String(n)
            )
          : [String(data.name as any)],
      };
      delete payload.name;
    }

    const response = await this.axios.patch<Level>(
      `/volunteer/levels/${id}/`,
      payload
    );
    return response.data;
  }

  async deleteLevel(id: number): Promise<void> {
    await this.axios.delete(`/volunteer/levels/${id}/`);
  }

  async getDesignations(
    levelName?: string,
    wingName?: string
  ): Promise<Designation[]> {
    const params: any = {};
    if (levelName !== undefined && levelName !== null) params.level = levelName;
    if (wingName !== undefined && wingName !== null) params.wings = wingName;
    const response = await this.axios.get("/volunteer/designations/", {
      params,
    });
    const payload = response.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  }

  async getDesignation(level: string, wing: string): Promise<Designation> {
    const response = await this.axios.get<Designation>(
      `/volunteer/designations/?level=${level}&wings=${wing}`
    );
    return response.data;
  }

  async createDesignation(data: DesignationFormData): Promise<Designation> {
    const response = await this.axios.post<Designation>(
      "/volunteer/designations/",
      data
    );
    return response.data;
  }

  async updateDesignation(
    id: number,
    data: Partial<DesignationFormData>
  ): Promise<Designation> {
    const response = await this.axios.patch<Designation>(
      `/volunteer/designations/${id}/`,
      data
    );
    return response.data;
  }

  async deleteDesignation(id: number): Promise<void> {
    await this.axios.delete(`/volunteer/designations/${id}/`);
  }

  async getVolunteer(id: number): Promise<Volunteer> {
    const response = await this.axios.get<Volunteer>(
      `/volunteer/volunteers/${id}/`
    );
    return response.data;
  }

  async createVolunteer(data: VolunteerFormData): Promise<Volunteer> {
    const response = await this.axios.post<Volunteer>(
      "/volunteer/volunteers/",
      data
    );
    return response.data;
  }

  async updateVolunteer(
    id: number,
    data: Partial<VolunteerFormData>
  ): Promise<Volunteer> {
    const response = await this.axios.patch<Volunteer>(
      `/volunteer/volunteers/${id}/`,
      data
    );
    return response.data;
  }

  async deleteVolunteer(id: number): Promise<void> {
    await this.axios.delete(`/volunteer/volunteers/${id}/`);
  }

  async getVolunteerStats(): Promise<{
    total_volunteers: number;
    by_wing: Record<string, number>;
    by_level: Record<string, number>;
    by_designation: Record<string, number>;
  }> {
    const response = await this.axios.get("/volunteer/stats/");
    return response.data;
  }

  // User Management
  async getUsers(page: number = 1, search?: string): Promise<UserListResponse> {
    const response = await this.axios.get<UserListResponse>("/account/list/", {
      params: { page, search },
    });
    return response.data;
  }

  async getUser(id: number): Promise<User> {
    const response = await this.axios.get<User>(`/account/detail/${id}/`);
    return response.data;
  }

  // Application Management
  async getApplications(
    filters?: ApplicationFilters,
    page: number = 1
  ): Promise<PaginatedResponse<Application>> {
    const response = await this.axios.get<PaginatedResponse<Application>>(
      "/volunteer/applications/",
      {
        params: { ...filters, page },
      }
    );
    return response.data;
  }

  async getApplication(id: number): Promise<Application> {
    const response = await this.axios.get<Application>(
      `/volunteer/applications/${id}/`
    );
    return response.data;
  }

  async createApplication(data: ApplicationFormData): Promise<Application> {
    const formData = new FormData();

    if (data.user) {
      formData.append("user", data.user.toString());
    }

    if (data.wing !== undefined && data.wing !== null) {
      formData.append("wing", data.wing.toString());
    }
    if (data.level !== undefined && data.level !== null) {
      formData.append("level", data.level.toString());
    }
    if (data.designation !== undefined && data.designation !== null) {
      formData.append("designation", data.designation.toString());
    }
    if (data.phone_number !== undefined && data.phone_number !== null) {
      formData.append("phone_number", data.phone_number);
    }
    formData.append("status", "pending");

    if (data.affidavit) {
      formData.append("affidavit", data.affidavit);
    }
    if (data.aadhar_card_front) {
      formData.append("aadhar_card_front", data.aadhar_card_front);
    }
    if (data.aadhar_card_back) {
      formData.append("aadhar_card_back", data.aadhar_card_back);
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await this.axios.post<Application>(
      "/volunteer/applications/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async updateApplication(
    id: number,
    data: Partial<ApplicationFormData & { status?: string; remarks?: string }>
  ): Promise<Application> {
    const formData = new FormData();

    if (data.wing) formData.append("wing", data.wing.toString());
    if (data.level) formData.append("level", data.level.toString());
    if (data.designation)
      formData.append("designation", data.designation.toString());
    if (data.status) formData.append("status", data.status);
    if (data.remarks) formData.append("remarks", data.remarks);
    if (data.affidavit) formData.append("affidavit", data.affidavit);

    const response = await this.axios.patch<Application>(
      `/volunteer/applications/${id}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async deleteApplication(id: number): Promise<void> {
    await this.axios.delete(`/volunteer/applications/${id}/`);
  }
}

export const createVolunteerAPI = (axios: AxiosInstance) =>
  new VolunteerAPI(axios);
