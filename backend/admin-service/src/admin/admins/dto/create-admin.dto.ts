export class CreateAdminDto {
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
  permissions?: string[];
}

export class UpdateAdminDto {
  email?: string;
  name?: string;
  role?: string;
  permissions?: string[];
}