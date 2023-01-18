import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { RegaloDto } from '../regalo/regalo.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CarritoRegaloService } from './carrito-regalo.service';

@Controller('carritos')
@UseInterceptors(BusinessErrorsInterceptor)
export class CarritoRegaloController {
    constructor(private readonly carritoRegaloService: CarritoRegaloService){}

    @Post(':carritoId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CARRITO_REGALO_ADMIN, Role.CARRITO_REGALO_ESCRITURA)
    async addRegaloCarrito(@Param('carritoId') carritoId: string, @Param('regaloId') regaloId: string){
        return await this.carritoRegaloService.addRegaloCarrito(carritoId, regaloId);
    }

    @Get(':carritoId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CARRITO_REGALO_ADMIN, Role.CARRITO_REGALO_LECTURA)
    async findRegaloByCarritoIdRegaloId(@Param('carritoId') carritoId: string, @Param('regaloId') regaloId: string){
        return await this.carritoRegaloService.findRegaloByCarritoIdRegaloId(carritoId, regaloId);
    }

    @Get(':carritoId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CARRITO_REGALO_ADMIN, Role.CARRITO_REGALO_LECTURA)
    async findRegalosByCarritoId(@Param('carritoId') carritoId: string){
        return await this.carritoRegaloService.findRegalosByCarritoId(carritoId);
    }

    @Put(':carritoId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CARRITO_REGALO_ADMIN, Role.CARRITO_REGALO_ESCRITURA)
    async associateRegalosCarrito(@Body() regalosDto: RegaloDto[], @Param('carritoId') carritoId: string){
        const regalos = plainToInstance(RegaloEntity, regalosDto)
        return await this.carritoRegaloService.associateRegalosCarrito(carritoId, regalos);
    }
    
    @Delete(':carritoId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CARRITO_REGALO_ADMIN, Role.CARRITO_REGALO_ELIMINACION)
    @HttpCode(204)
    async deleteRegaloCarrito(@Param('carritoId') carritoId: string, @Param('regaloId') regaloId: string){
        return await this.carritoRegaloService.deleteRegaloCarrito(carritoId, regaloId);
    }
}