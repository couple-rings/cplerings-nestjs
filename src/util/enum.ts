export enum FileType {
  Image = 'image',
  Attachment = 'attachment',
}

export enum ConfigKey {
  Authentication = 'AUTHENTICATION',
}

export enum ResponseType {
  Data = 'DATA',
  Error = 'ERROR',
  Info = 'INFO',
  Paginated = 'PAGINATED_DATA',
}

export enum ErrorType {
  Validation = 'VALIDATION',
  Business = 'BUSINESS',
}

export enum UserRole {
  Default = '',
  Customer = 'CUSTOMER',
  Staff = 'STAFF',
  Manager = 'MANAGER',
  Jeweler = 'JEWELER',
  Admin = 'ADMIN',
  Transporter = 'TRANSPORTER',
}
