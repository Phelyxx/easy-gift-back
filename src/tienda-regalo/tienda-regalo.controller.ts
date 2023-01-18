/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RegaloEntity } from 'src/regalo/regalo.entity';
import { RegaloDto } from '../regalo/regalo.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaRegaloService} from './tienda-regalo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaRegaloController {
    constructor(private readonly tiendaRegaloService: TiendaRegaloService){}

    @Post(':tiendaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_REGALO_ADMIN, Role.TIENDA_REGALO_ESCRITURA)
    async addRegaloTienda(@Param('tiendaId') tiendaId: string, @Param('regaloId') regaloId: string){
        return await this.tiendaRegaloService.addRegaloTienda(tiendaId, regaloId);
    }

    @Get(':tiendaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_REGALO_ADMIN, Role.TIENDA_REGALO_LECTURA)
    async findRegaloByTiendaIdRegaloId(@Param('tiendaId') tiendaId: string, @Param('regaloId') regaloId: string){
        return await this.tiendaRegaloService.findRegaloByTiendaIdRegaloId(tiendaId, regaloId);
    }

    @Get(':tiendaId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_REGALO_ADMIN, Role.TIENDA_REGALO_LECTURA)
    async findRegalosByTiendaId(@Param('tiendaId') tiendaId: string){
        return await this.tiendaRegaloService.findRegalosByTiendaId(tiendaId);
    }

    @Put(':tiendaId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_REGALO_ADMIN, Role.TIENDA_REGALO_ESCRITURA)
    async associateRegalosTienda(@Body() regalosDto: RegaloDto[], @Param('tiendaId') tiendaId: string){
        const regalos = plainToInstance(RegaloEntity, regalosDto)
        return await this.tiendaRegaloService.associateRegalosTienda(tiendaId, regalos);
    }
    
    @Delete(':tiendaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.TIENDA_REGALO_ADMIN, Role.TIENDA_REGALO_ELIMINACION)
    @HttpCode(204)
    async deleteRegaloTienda(@Param('tiendaId') tiendaId: string, @Param('regaloId') regaloId: string){
        return await this.tiendaRegaloService.deleteRegaloTienda(tiendaId, regaloId);
    }
}