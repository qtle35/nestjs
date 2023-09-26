import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./service/auth.service";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./strategy/accesstoken.strategy";
import { AuthController } from "./controller/auth.controller";
import { RolesGuard } from "./role.guard";

@Module({
    imports: [
        PassportModule,
        UserModule,
        JwtModule.register({}),
    ],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }