import { apiClient } from '@/lib/http';

export enum ContactUserType {
  Student = 'student',
  Parent = 'parent',
  Organization = 'organization',
}

export interface ContactSubmissionDto {
  firstName: string;
  lastName: string;
  age: number;
  userType: ContactUserType;
  email: string;
  phoneNumber: string;
  hearAboutUs: string;
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    userType: ContactUserType;
    email: string;
    phoneNumber: string;
    hearAboutUs: string;
    createdAt: string;
  };
}

export const contactService = {
  async submitContact(data: ContactSubmissionDto): Promise<ContactSubmissionResponse> {
    const response = await apiClient.post<ContactSubmissionResponse>(
      '/contact/submit',
      data
    );
    return response;
  },
};

