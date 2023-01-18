import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/roles/role.enum';
import { RolesGuard } from '../user/roles/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaDto } from './categoria.dto';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';
import { Roles } from 'src/user/roles/roles.decorator';

@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CATEGORIA_ADMIN, Role.CATEGORIA_LECTURA)
  async findAll() {
    return await this.categoriaService.findAll();
  }

  @Get(':categoriaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CATEGORIA_ADMIN, Role.CATEGORIA_LECTURA)
  async findOne(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.findOne(categoriaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CATEGORIA_ADMIN, Role.CATEGORIA_ESCRITURA)
  async create(@Body() categoriaDto: CategoriaDto) {
    const categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.create(categoria);
  }

  @Put(':categoriaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CATEGORIA_ADMIN, Role.CATEGORIA_ESCRITURA)
  async update(@Param('categoriaId') categoriaId: string, @Body() categoriaDto: CategoriaDto) {
    const categoria: CategoriaEntity = plainToInstance(CategoriaEntity, categoriaDto);
    return await this.categoriaService.update(categoriaId, categoria);
  }

  @Delete(':categoriaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CATEGORIA_ADMIN, Role.CATEGORIA_ELIMINACION)
  @HttpCode(204)
  async delete(@Param('categoriaId') categoriaId: string) {
    return await this.categoriaService.delete(categoriaId);
  }
}
