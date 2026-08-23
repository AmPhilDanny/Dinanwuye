export class CreateUserDto {
  email: string = '';
  name: string = '';
  passwordHash: string = '';
  role?: string;
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
  isActive?: boolean;
}