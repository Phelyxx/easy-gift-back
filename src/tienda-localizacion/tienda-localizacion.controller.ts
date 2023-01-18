
/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaLocalizacionService } from './tienda-localizacion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaLocalizacionController {
    constructor(private readonly tiendaLocalizacionService: TiendaLocalizacionService){}

    @Post(':tiendaId/localizacion/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_LOCALIZACION_ADMIN, Role.TIENDA_LOCALIZACION_ESCRITURA)
    async addLocalizacionTienda(@Param('tiendaId') tiendaId: string, @Param('localizacionId') localizacionId: string){
        return await this.tiendaLocalizacionService.addLocalizacionTienda(tiendaId, localizacionId);
    }

    @Get(':tiendaId/localizacion/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_LOCALIZACION_ADMIN, Role.TIENDA_LOCALIZACION_LECTURA)
    async findLocalizacionByTiendaIdLocalizacionId(@Param('tiendaId') tiendaId: string, @Param('localizacionId') localizacionId: string){
        return await this.tiendaLocalizacionService.findLocalizacionByTiendaIdLocalizacionId(tiendaId, localizacionId);
    }

    @Get(':tiendaId/localizacion')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_LOCALIZACION_ADMIN, Role.TIENDA_LOCALIZACION_LECTURA)
    async findLocalizacionByTiendaId(@Param('tiendaId') tiendaId: string){
        return await this.tiendaLocalizacionService.findLocalizacionByTiendaId(tiendaId);
    }

    @Put(':tiendaId/localizacion/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_LOCALIZACION_ADMIN, Role.TIENDA_LOCALIZACION_ESCRITURA)
    async associateLocalizacionesTienda( @Param('localizacionId') localizacionId: string, @Param('tiendaId') tiendaId: string){
        return await this.tiendaLocalizacionService.associateLocalizacionTienda(tiendaId, localizacionId);
    }
    
    @Delete(':tiendaId/localizacion/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_LOCALIZACION_ADMIN, Role.TIENDA_LOCALIZACION_ELIMINACION)
    @HttpCode(204)
    async deleteLocalizacionTienda(@Param('tiendaId') tiendaId: string, @Param('localizacionId') localizacionId: string){
        return await this.tiendaLocalizacionService.deleteLocalizacionTienda(tiendaId, localizacionId);
    }
}