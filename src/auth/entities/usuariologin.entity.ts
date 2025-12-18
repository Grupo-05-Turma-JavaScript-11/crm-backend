import { ApiProperty } from "@nestjs/swagger";

export class UsuarioLogin {

    @ApiProperty({ example: "email@email.com.br" })
    email: string;

    @ApiProperty({ example: "12345678" })
    senha: string;
}
