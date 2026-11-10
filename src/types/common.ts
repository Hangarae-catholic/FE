export type CommonResponse<T> = {
  code: string;
  message: string;
  data: T | null;
  httpStatus: string;
};
