import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { Medico } from "../entities/medico.entity";


@Controller("/medicos")
export class MedicoController{
    constructor(private readonly medicoService){}

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
}

/*

@Post()
    @HttpCode(HttpStatus.CREATED)  // httpstatus: 201
    create(@Body() medico: Medico): Promise<Medico>{ // @body -> enviar informações no corpo da solicitação
        return this.medicoService.create(medico);
    }
@Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() medico: Postagem): Promise<Postagem> { 
        return this.medicoService.update(medico);
    }

@Patch(':id')
    updatePartial(@Param('id', ParseIntPipe) id: number, 
    @Body() dto: Partial<UpdateMedicoDto>): Promise<Medico> 
    {
        return this.medicoService.updatePartial(id, dto);
    }

@Delete()
    @HttpCode(HttpStatus.NO_CONTENT) 
    delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
        return this.medicoService.delete(id);
    }

*/