import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { Medico } from "../entities/medico.entity";
import { DeleteResult } from "typeorm";
import { MedicoService } from "../services/medico.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";


@ApiTags('Tema')
@UseGuards(JwtAuthGuard)
@Controller("/temas")
@ApiBearerAuth()
export class MedicoController{
    constructor(private readonly medicoService: MedicoService){}

    @Get() // Indica qual tipo de Requisição esse método é executado
    @HttpCode(HttpStatus.OK)  // monta a Resposta HTTP para o Front com o status 200
    findAll(): Promise<Medico[]>{
        return this.medicoService.findAll()
    }

    @Get( "/:id") // sai de id = "1" --> id = 1
    @HttpCode(HttpStatus.OK) // monta a Resposta HTTP para o Front com o status 200 
    findById(@Param('id', ParseIntPipe) id: number): Promise<Medico>{// @Param captura o paramêtro envia pelo endpoint e o atribui ao parametro do método findById(id:number)
        return this.medicoService.findById(id)
    }
    
    @Get( "/nome/:nome") // medicos/nome/{texto}
    @HttpCode(HttpStatus.OK) 
    findAllByName(@Param('nome') nome: string): Promise<Medico[]>{
        return this.medicoService.findAllByName(nome)
    }

   @Post() 
    @HttpCode(HttpStatus.CREATED)  
    create(@Body() medico: Medico): Promise<Medico> {
        return this.medicoService.create(medico);
    }
 
    @Put()
    @HttpCode(HttpStatus.OK) 
    update(@Body() medico: Medico): Promise<Medico> {
        return this.medicoService.update(medico);
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT) 
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.medicoService.delete(id);
    }

}