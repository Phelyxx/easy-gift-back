
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { LocalizacionDto } from './localizacion.dto';
import { LocalizacionEntity } from './localizacion.entity';
import { LocalizacionService } from './localizacion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('localizaciones')
@UseInterceptors(BusinessErrorsInterceptor)
export class LocalizacionController {
    constructor(private readonly localizacionService: LocalizacionService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LOCALIZACION_ADMIN, Role.LOCALIZACION_LECTURA)
  async findAll() {
    return await this.localizacionService.findAll();
  }

  @Get(':localizacionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LOCALIZACION_ADMIN, Role.LOCALIZACION_LECTURA)
  async findOne(@Param('localizacionId') localizacionId: string) {
    return await this.localizacionService.findOne(localizacionId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LOCALIZACION_ADMIN, Role.LOCALIZACION_ESCRITURA)
  async create(@Body() localizacionDto: LocalizacionDto) {
    const localizacion: LocalizacionEntity = plainToInstance(LocalizacionEntity, localizacionDto);
    return await this.localizacionService.create(localizacion);
  }

  @Put(':localizacionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LOCALIZACION_ADMIN, Role.LOCALIZACION_ESCRITURA)
  async update(@Param('localizacionId') localizacionId: string, @Body() localizacionDto: LocalizacionDto) {
    const localizacion: LocalizacionEntity = plainToInstance(LocalizacionEntity, localizacionDto);
    return await this.localizacionService.update(localizacionId, localizacion);
  }

  @Delete(':localizacionId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.LOCALIZACION_ADMIN, Role.LOCALIZACION_ELIMINACION)
  @HttpCode(204)
  async delete(@Param('localizacionId') localizacionId: string) {
    return await this.localizacionService.delete(localizacionId);
  }

}