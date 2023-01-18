import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TiendaDto } from '../tienda/tienda.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RegaloTiendaService } from './regalo-tienda.service';
import { TiendaEntity } from '../tienda/tienda.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('regalos')
@UseInterceptors(BusinessErrorsInterceptor)
export class RegaloTiendaController {
    /**
     * El constructor del controlador
     * @param regaloTiendaService el servicio entre regalo y tiendas
     */
    constructor(private readonly regaloTiendaService: RegaloTiendaService){}

    /**
     * Agrega una tienda a un regalo llamando al metodo de la logica
     * @param regaloId el id de la wishlist al que se agrega una tienda
     * @param tiendaId el id de la tienda a agregar
     * @returns el regalo con la tienda nueva
     */
    @Post(':regaloId/tiendas/:tiendaId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_TIENDA_ADMIN, Role.REGALO_TIENDA_ESCRITURA)
    async addTiendaRegalo(@Param('regaloId') regaloId: string, @Param('tiendaId') tiendaId: string){
        return await this.regaloTiendaService.addTiendaRegalo(regaloId, tiendaId);
    }
    
    /**
     * Busca una tienda asociada a un regalo llamando al metodo de la logica
     * @param regaloId el id del regalo al que se le busca una tienda determinada
     * @param tiendaId el id de la tienda buscada
     * @returns la tienda buscada
     */
    @Get(':regaloId/tiendas/:tiendaId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_TIENDA_ADMIN, Role.REGALO_TIENDA_LECTURA)
    async findTiendaByRegaloIdTiendaId(@Param('regaloId') regaloId: string, @Param('tiendaId') tiendaId: string){
        return await this.regaloTiendaService.findTiendaByRegaloIdTiendaId(regaloId, tiendaId);
    }

    /**
     * Busca las tiendas asociadas a un regalo determinado llamando al metodo de la logica
     * @param regaloId el id del regalo para el que se buscaran todas las tiendas
     * @returns las tiendas del regalo
     */
    @Get(':regaloId/tiendas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_TIENDA_ADMIN, Role.REGALO_TIENDA_LECTURA)
    async findTiendasByRegaloId(@Param('regaloId') regaloId: string){
        return await this.regaloTiendaService.findTiendasByRegaloId(regaloId);
    }

    /**
     * Actualiza las tiendas de un regalo determinado llamando al metodo de la logica
     * @param tiendasDto el DTO con las tiendas que seran actualizadas para un regalo
     * @param regaloId el id del regalo al que se le van a actualizar las tiendas
     * @returns el regalo con sus tiendas actualizadas
     */
    @Put(':regaloId/tiendas')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_TIENDA_ADMIN, Role.REGALO_TIENDA_ESCRITURA)
    async associateTiendasRegalo(@Body() tiendasDto: TiendaDto[], @Param('regaloId') regaloId: string){
        const tiendas = plainToInstance(TiendaEntity, tiendasDto)
        return await this.regaloTiendaService.associateTiendasRegalo(regaloId, tiendas);
    }
    /**
     * Elimina una tienda de un regalo llamando al metodo de la logica. Retorna un codigo 204 si la ejecucion
     * es exitosa.
     * @param regaloId el id del regalo al que se le va a eliminar una tienda
     * @param tiendaId la tienda que se va a eliminar del regalo
     * @returns el regalo sin la tienda
     */
    @Delete(':regaloId/tiendas/:tiendaId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.REGALO_TIENDA_ADMIN, Role.REGALO_TIENDA_ELIMINACION)
    async deleteTiendaRegalo(@Param('regaloId') regaloId: string, @Param('tiendaId') tiendaId: string){
        return await this.regaloTiendaService.deleteTiendaRegalo(regaloId, tiendaId);
    }
}
