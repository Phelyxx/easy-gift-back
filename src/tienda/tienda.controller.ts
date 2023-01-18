import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards,} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TiendaDto } from './tienda.dto';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('tiendas')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
    constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TIENDA_ADMIN, Role.TIENDA_LECTURA)
  async findAll() {
    return await this.tiendaService.findAll();
  }

  @Get(':tiendaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TIENDA_ADMIN, Role.TIENDA_LECTURA)
  async findOne(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.findOne(tiendaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TIENDA_ADMIN, Role.TIENDA_ESCRITURA)
  async create(@Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.create(tienda);
  }

  @Put(':tiendaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TIENDA_ADMIN, Role.TIENDA_ESCRITURA)
  async update(@Param('tiendaId') tiendaId: string, @Body() tiendaDto: TiendaDto) {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.update(tiendaId, tienda);
  }

  @Delete(':tiendaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TIENDA_ADMIN, Role.TIENDA_ELIMINACION)
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: string) {
    return await this.tiendaService.delete(tiendaId);
  }

}