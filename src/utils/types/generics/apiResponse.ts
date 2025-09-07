export interface ApiResponse<T> {
  message: string;
  success: boolean;
  code: number;
  data: T;
}
