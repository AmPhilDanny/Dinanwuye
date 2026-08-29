"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = exports.CreateUserDto = void 0;
class CreateUserDto {
    email = '';
    name = '';
    passwordHash = '';
    role;
}
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto {
    email;
    name;
    role;
    isActive;
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=create-user.dto.js.map