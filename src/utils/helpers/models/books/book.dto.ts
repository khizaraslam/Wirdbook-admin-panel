export interface BookDTO {
  filename: string;
  size: number;
  updatedAt: string;
  url: string;
}

export interface BookUploadResponse {
  filename?: string;
  replaced?: boolean;
  size?: number;
  updatedAt?: string;
  url?: string;
}
