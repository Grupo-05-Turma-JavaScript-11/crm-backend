import { ApiProperty } from "@nestjs/swagger";

export class UsuarioLogin {

    @ApiProperty({ example: "email@email.com.br" })
    public email: string;

    @ApiProperty({ example: "12345678" })
    public senha: string;
}
