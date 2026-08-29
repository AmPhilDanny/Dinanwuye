"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const users_module_1 = require("./users/users.module");
const profiles_module_1 = require("./profiles/profiles.module");
const photos_module_1 = require("./photos/photos.module");
const matches_module_1 = require("./matches/matches.module");
const swipes_module_1 = require("./swipes/swipes.module");
const audit_module_1 = require("./audit/audit.module");
const admins_module_1 = require("./admins/admins.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            profiles_module_1.ProfilesModule,
            photos_module_1.PhotosModule,
            matches_module_1.MatchesModule,
            swipes_module_1.SwipesModule,
            audit_module_1.AuditModule,
            admins_module_1.AdminsModule,
        ],
        controllers: [],
        providers: [],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map