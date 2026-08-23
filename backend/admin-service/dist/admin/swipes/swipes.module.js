"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwipesModule = void 0;
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const swipes_controller_1 = require("./swipes.controller");
const swipes_service_1 = require("./swipes.service");
let SwipesModule = class SwipesModule {
};
exports.SwipesModule = SwipesModule;
exports.SwipesModule = SwipesModule = __decorate([
    (0, common_1.Module)({
        controllers: [swipes_controller_1.SwipesController],
        providers: [swipes_service_1.SwipesService],
        exports: [swipes_service_1.SwipesService],
    })
], SwipesModule);
//# sourceMappingURL=swipes.module.js.map