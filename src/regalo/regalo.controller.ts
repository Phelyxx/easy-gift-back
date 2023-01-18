import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../user/roles/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RegaloDto } from './regalo.dto';
import { RegaloEntity } from './regalo.entity';
import { RegaloService } from './regalo.service';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('regalos')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegaloController {
    /**
     * Constructor del controlador del regalo
     * @param regaloService el servicio inyectado del regalo
     */
    constructor(private readonly regaloService: RegaloService) {}

    /**
     * Este metodo llama al metodo de encontrar todos los regalos del servicio de regalo
     * @returns todos los regalos
     */
     @Get()
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.REGALO_ADMIN, Role.REGALO_LECTURA)
     async findAll() {
         return await this.regaloService.findAll();
     }
 
     /**
      * Llama al metodo de findOne en la logica para obtener el regalo que se desea obtener
      * @param regaloId el id del regalo en especifico que busca obtenerse
      * @returns el regalo deseado
      */
     @Get(':regaloId')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.REGALO_ADMIN, Role.REGALO_LECTURA)
     async findOne(@Param('regaloId') regaloId: string) {
         return await this.regaloService.findOne(regaloId);
     }
 
     /**
      * Llama al metodo create en la logica para crear el regalo que viene por parametro
      * @param regaloDto el DTO del regalo que se guardara, que viene en la peticion
      * @returns el regalo creado
      */
     @Post()
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.REGALO_ADMIN, Role.REGALO_ESCRITURA)
     async create(@Body() regaloDto: RegaloDto) {
         const regalo: RegaloEntity = plainToInstance(RegaloEntity, regaloDto);
         return await this.regaloService.create(regalo);
     }
 
     /**
      * Actualiza un regalo, llamando al metodo update de la logica
      * @param regaloId el id del regalo que se va a modificar
      * @param regaloDto el DTO del regalo con los campos a actualizar
      * @returns el regalo actualizado
      */
     @Put(':regaloId')
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.REGALO_ADMIN, Role.REGALO_ESCRITURA)
     async update(@Param('regaloId') regaloId: string, @Body() regaloDto: RegaloDto) {
         const regalo: RegaloEntity = plainToInstance(RegaloEntity, regaloDto);
         return await this.regaloService.update(regaloId, regalo);
     }
 
     /**
      * Elimina un regalo llamando al metodo delete de la logica. Responde con el codigo 204.
      * @param regaloId el id del regalo a eliminar
      * @returns el regalo eliminado
      */
     @Delete(':regaloId')
     @HttpCode(204)
     @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.REGALO_ADMIN, Role.REGALO_ELIMINACION)
     async delete(@Param('regaloId') regaloId: string) {
         return await this.regaloService.delete(regaloId);
     }
}
