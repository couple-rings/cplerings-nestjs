import { ErrorType, ResponseType, UserRole } from 'src/util/enum';

export {};

declare global {
  interface IResponseError {
    code: string;
    description: string;
    type: ErrorType;
  }

  interface IResponse<T> {
    timestamp: string;
    type: ResponseType;
    errors?: IResponseError[];
    data?: T;
  }

  interface IListMetaData {
    page: number;
    pageSize: number;
    totalPages: number;
    count: number;
  }

  interface IListResponse<T> extends IListMetaData {
    items: T[];
  }

  interface ILoginResponse {
    token: string;
    refreshToken: string;
  }

  interface IRefreshTokenResponse extends ILoginResponse {}

  interface IUser {
    id: number;
    email: string;
    username: string;
    phone?: string;
    avatar?: string;
    role: UserRole;
  }
}
