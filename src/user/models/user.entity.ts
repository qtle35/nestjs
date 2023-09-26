import { IsAlpha, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/user_role/role.enum";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Column({ default: false })
    isActive: boolean;

    @Column({
        type: 'enum',
        enum: Role,
        array: true,
        default: [Role.User]
    })
    roles: Role[]


}