import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CarritoDto } from './carrito.dto';
import { CarritoEntity } from './carrito.entity';
import { CarritoService } from './carrito.service';

@Controller('carritos')
@UseInterceptors(BusinessErrorsInterceptor)
export class CarritoController {
    constructor(private readonly carritoService: CarritoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CARRITO_ADMIN, Role.CARRITO_LECTURA)
  async findAll() {
    return await this.carritoService.findAll();
  }

  @Get(':carritoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CARRITO_ADMIN, Role.CARRITO_LECTURA)
  async findOne(@Param('carritoId') carritoId: string) {
    return await this.carritoService.findOne(carritoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CARRITO_ADMIN, Role.CARRITO_ESCRITURA)
  async create(@Body() carritoDto: CarritoDto) {
    const carrito: CarritoEntity = plainToInstance(CarritoEntity, carritoDto);
    return await this.carritoService.create(carrito);
  }

  @Put(':carritoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CARRITO_ADMIN, Role.CARRITO_ESCRITURA)
  async update(@Param('carritoId') carritoId: string, @Body() carritoDto: CarritoDto) {
    const carrito: CarritoEntity = plainToInstance(CarritoEntity, carritoDto);
    return await this.carritoService.update(carritoId, carrito);
  }

  @Delete(':carritoId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CARRITO_ADMIN, Role.CARRITO_ELIMINACION)
  @HttpCode(204)
  async delete(@Param('carritoId') carritoId: string) {
    return await this.carritoService.delete(carritoId);
  }
}
