export interface ApiResponseImpl<T> {
  code: number;
  message: string;
  data: T
}
