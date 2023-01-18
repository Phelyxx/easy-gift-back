import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { CategoriaDto } from '../categoria/categoria.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RegaloCategoriaService } from './regalo-categoria.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('regalos')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegaloCategoriaController {

    /**
     * Constructor del controlador para la asociacion Regalo-Categoria
     * @param regaloCategoriaService el servicio de la asociacion Regalo-Categoria
     */
    constructor(private readonly regaloCategoriaService: RegaloCategoriaService){}
    
    /**
     * Agrega una categoria a un regalo, llamando al metodo de la logica
     * @param regaloId el id del regalo al que se le va a agregar una categoria
     * @param categoriaId el id de la categoria a agregar
     * @returns el regalo con la nueva categoria creada
     */
    @Post(':regaloId/categorias/:categoriaId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_CATEGORIA_ADMIN, Role.REGALO_CATEGORIA_ESCRITURA)
    async addCategoriaRegalo(@Param('regaloId') regaloId: string, @Param('categoriaId') categoriaId: string){
        return await this.regaloCategoriaService.addCategoriaRegalo(regaloId, categoriaId);
    }

    /**
     * Busca la categoria de un regalo, llamando al metodo de la logica
     * @param regaloId el id del regalo al que se le busca una categoria determinada
     * @param categoriaId el id de la categoria a buscar
     * @returns la categoria buscada
     */
    @Get(':regaloId/categorias/:categoriaId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_CATEGORIA_ADMIN, Role.REGALO_CATEGORIA_LECTURA)
    async findCategoriaByRegaloIdCategoriaId(@Param('regaloId') regaloId: string, @Param('categoriaId') categoriaId: string){
        return await this.regaloCategoriaService.findCategoriaByRegaloIdCategoriaId(regaloId, categoriaId);
    }

    /**
     * Busca las categorias de un regalo, llamando al metodo de la logica
     * @param regaloId el id del regalo al que se le buscan las categorias
     * @returns las categorias de un regalo
     */
    @Get(':regaloId/categorias')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_CATEGORIA_ADMIN, Role.REGALO_CATEGORIA_LECTURA)
    async findCategoriasByRegaloId(@Param('regaloId') regaloId: string){
        return await this.regaloCategoriaService.findCategoriasByRegaloId(regaloId);
    }

    /**
     * Actualiza las categorias de un regalo, llamando al metodo de la logica
     * @param categoriasDto DTOs de categorias a ser actualizadas para el regalo
     * @param regaloId el id del regalo al que se le van a actualizar las categorias
     * @returns el regalo con la nueva categoria asociada
     */
    @Put(':regaloId/categorias')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_CATEGORIA_ADMIN, Role.REGALO_CATEGORIA_ESCRITURA)
    async associateCategoriasRegalo(@Body() categoriasDto: CategoriaDto[], @Param('regaloId') regaloId: string){
        const categorias = plainToInstance(CategoriaEntity, categoriasDto)
        return await this.regaloCategoriaService.associateCategoriasRegalo(regaloId, categorias);
    }
    
    /**
     * Elimina una categoria de un regalo llamando al metodo de la logica. Retorna un codigo 204 si la ejecucion
     * es exitosa.
     * @param regaloId el id del regalo al que se va a eliminar una categoria
     * @param categoriaId el id de la categoria a eliminar del regalo
     * @returns el regalo sin la nueva categoria
     */
    @Delete(':regaloId/categorias/:categoriaId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_CATEGORIA_ADMIN, Role.REGALO_CATEGORIA_ELIMINACION)
    async deleteCategoriaRegalo(@Param('regaloId') regaloId: string, @Param('categoriaId') categoriaId: string){
        return await this.regaloCategoriaService.deleteCategoriaRegalo(regaloId, categoriaId);
    }
}
