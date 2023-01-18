import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { UsuarioCategoriaService } from './usuario-categoria.service';
import { CategoriaDto } from '../categoria/categoria.dto';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioCategoriaController {
    constructor(private readonly usuarioCategoriaService: UsuarioCategoriaService){}

    @Roles(Role.USUARIO_CATEGORIA_ADMIN, Role.USUARIO_CATEGORIA_ESCRITURA)
    @Post(':usuarioId/categorias/:categoriaId')
   async addAmigousuario(@Param('usuarioId') usuarioId: string, @Param('categoriaId') categoriaId: string){
       return await this.usuarioCategoriaService.addCategoriaUsuario(usuarioId, categoriaId);
   }


   @Roles(Role.USUARIO_CATEGORIA_ADMIN, Role.USUARIO_CATEGORIA_LECTURA)
   @Get(':usuarioId/categorias/:categoriaId')
   async findamigoByusuarioIdamigoId(@Param('usuarioId') usuarioId: string, @Param('categoriaId') categoriaId: string){
       return await this.usuarioCategoriaService.findCategoriaByUsuarioIdCategoriaId(usuarioId, categoriaId);
   }


   @Roles(Role.USUARIO_CATEGORIA_ADMIN, Role.USUARIO_CATEGORIA_LECTURA)
   @Get(':usuarioId/categorias')
   async findamigosByusuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioCategoriaService.findCategoriasByUsuarioId(usuarioId);
   }

   @Roles(Role.USUARIO_CATEGORIA_ADMIN, Role.USUARIO_CATEGORIA_ESCRITURA)
   @Put(':usuarioId/categorias')
   async associateAmigosUsuario(@Body() categoriasDto: CategoriaDto[], @Param('usuarioId') usuarioId: string){
       const categorias = plainToInstance(CategoriaEntity, categoriasDto)
       return await this.usuarioCategoriaService.associateCategoriaUsuario(usuarioId, categorias);
   }

   @Roles(Role.USUARIO_CATEGORIA_ADMIN, Role.USUARIO_CATEGORIA_ELIMINACION)
   @Delete(':usuarioId/categorias/:categoriaId')
    @HttpCode(204)
   async deleteAmigoUsuario(@Param('usuarioId') usuarioId: string, @Param('categoriaId') categoriaId: string){
       return await this.usuarioCategoriaService.deleteCategoriaUsuario(usuarioId, categoriaId);
   }  




}
