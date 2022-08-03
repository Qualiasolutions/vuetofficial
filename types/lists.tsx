import { BaseEntityType } from './entities';

export type ListEntryResponse = {
  id: number;
  list: number;
  title: string;
  selected: boolean;
  image: string;
  notes: string;
  phone_number: string;
  image_200_200: string;
  presigned_image_url: string;
};

export type ListEntryCreateRequest = {
  list: number;
  title?: string;
  selected?: boolean;
  image?: string;
  notes?: string;
  phone_number?: string;
};

export type ListEntryUpdateRequest = {
  id: number;
  list?: number;
  title?: string;
  selected?: boolean;
  image?: string;
  notes?: string;
  phone_number?: string;
};

export type FormUpdateListEntryRequest = {
  id: number;
  formData?: FormData;
};
