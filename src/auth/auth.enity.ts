import { ApiProperty } from "@nestjs/swagger";

export class AuthEntity{
    @ApiProperty()
    name: string;
    @ApiProperty()
    password: string;
}