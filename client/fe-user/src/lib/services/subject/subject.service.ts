import { Endpoints } from "@/lib/endpoints";
import {
  SubjectFilterByCredits,
  SubjectListResponse,
  SubjectQuery,
  SubjectResponse,
  SubjectStatsResponse,
} from "@/models/subject";
import axiosService from "../config/axios.service";

class SubjectService {
  /**
   * Get all subjects with optional query parameters
   */
  async getAllSubjects(query?: SubjectQuery): Promise<SubjectListResponse> {
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.search) params.append("search", query.search);
    if (query?.sortBy) params.append("sortBy", query.sortBy);
    if (query?.sortOrder) params.append("sortOrder", query.sortOrder);

    const response = await axiosService
      .getAxiosInstance()
      .get(`${Endpoints.Subject.GET_ALL}?${params.toString()}`);
    return response.data;
  }

  /**
   * Get subject by ID
   */
  async getSubjectById(id: string): Promise<SubjectResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Subject.GET_BY_ID(id));
    return response.data;
  }

  /**
   * Get subject by subject code
   */
  async getSubjectByCode(code: string): Promise<SubjectResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Subject.GET_BY_CODE(code));
    return response.data;
  }

  /**
   * Get subject statistics
   */
  async getSubjectsStats(): Promise<SubjectStatsResponse> {
    const response = await axiosService
      .getAxiosInstance()
      .get(Endpoints.Subject.GET_STATS);
    return response.data;
  }

  /**
   * Get subjects filtered by credits
   */
  async getSubjectsByCredits(
    filter: SubjectFilterByCredits
  ): Promise<SubjectListResponse> {
    const params = new URLSearchParams();
    if (filter.minCredits)
      params.append("minCredits", filter.minCredits.toString());
    if (filter.maxCredits)
      params.append("maxCredits", filter.maxCredits.toString());

    const response = await axiosService
      .getAxiosInstance()
      .get(`${Endpoints.Subject.GET_BY_CREDITS}?${params.toString()}`);
    return response.data;
  }
}

export default new SubjectService();
