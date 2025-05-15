export interface ApiErrorResponse {
  message: string;
  details?: { path: string; message: string }[];
}

export interface GenerateQrResponse {
  url: string;
}
