export interface ResponseHelper<T> {
  success: boolean;
  message: string;
  data: T;
}
