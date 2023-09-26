import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "src/user/models/user.entity";
import { UserService } from "src/user/service/user.service";
import * as bcrypt from 'bcrypt';
import { AuthEntity } from "../auth.enity";
import { jwtConstants } from "../constants";
import { MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) { }
    async signUp(user: UserEntity): Promise<any> {

        const userExists = await this.userService.findMail(user.email);
        console.log(userExists);
        if (userExists && userExists.isActive) {
            throw new BadRequestException('user hoac mail ton tai');
        }
        if (!userExists) {
            this.userService.add(user);
        }
        const tokens = await this.getTokens(user);
        try {
            this.sendMail(tokens.accessToken[0]);
        }
        catch (error) {
            throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
        }
    }
    async signIn(data: AuthEntity) {
        const user = await this.userService.findUser(data.name);
        if (!user) throw new BadRequestException('User does not exist');
        else if (!user.isActive) {
            throw new BadRequestException('khong ton tai tk');
        }
        const passMatch = await bcrypt.compare(data.password, user.password);
        if (!passMatch)
            throw new BadRequestException('sai pass');
        const tokens = await this.getTokens(user);
        return tokens;
    }
    async verifyEmail(tokenMail: string): Promise<boolean> {
        try {
            const decodedToken = this.jwtService.decode(tokenMail) as Record<string, any>;
            const user = await this.userService.findMail(decodedToken.mail);
            // console.log(user)
            if (user) {
                user.isActive = true;
                await this.userService.update(user.id, user);
                return true;
            }
            return false;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async sendMail(mailToken: string) {
        this.mailerService.sendMail({
            to: 'quyet09875@mailinator.com',
            from: 'quyet09872@mailinator.com',
            subject: 'Test',
            text: 'hhh',
            html: 'Hi! <br><br> Thanks for your registration<br><br>' +
                '<a href=' + 'http://localhost:3000' + '/auth/email/verify/' + mailToken + '>Click here to activate your account</a>'
        });
    }
    async getTokens(user: UserEntity) {
        const accessToken = await Promise.all([
            this.jwtService.signAsync({
                sub: user.id,
                name: user.name,
                email: user.email,
                roles: user.roles,
            },
                {
                    secret: jwtConstants.secret,
                    expiresIn: '15m',
                },
            ),
        ]);
        return {
            accessToken,
        }
    }
}