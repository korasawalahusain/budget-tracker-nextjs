export type Message = {
  title: string;
  description?: string;
};

export type Error = {};

export type Response<T> =
  | {
      success: true;
      data: T;
      message?: Message;
    }
  | {
      success: false;
      errors?: Message[];
      validationErrors?: {
        field: string;
        description?: string;
      }[];
    };
