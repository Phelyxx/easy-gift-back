import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioUsuarioService } from './usuario-usuario.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsuarioDto } from '../usuario/usuario.dto';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioUsuarioController {

    constructor(private readonly usuarioUsuarioService: UsuarioUsuarioService){}

    @Post(':usuarioId/amigos/:amigoId')
    @Roles(Role.USUARIO_USUARIO_ADMIN, Role.USUARIO_USUARIO_ESCRITURA)
   async addAmigousuario(@Param('usuarioId') usuarioId: string, @Param('amigoId') amigoId: string){
       return await this.usuarioUsuarioService.addAmigousuario(usuarioId, amigoId);
   }


   @Roles(Role.USUARIO_USUARIO_ADMIN, Role.USUARIO_USUARIO_LECTURA)
   @Get(':usuarioId/amigos/:amigoId')
   async findCategoriaByUsuarioIdCategoriaId(@Param('usuarioId') usuarioId: string, @Param('amigoId') amigoId: string){
       return await this.usuarioUsuarioService.findamigoByusuarioIdamigoId(usuarioId, amigoId);
   }

   @Roles(Role.USUARIO_USUARIO_ADMIN, Role.USUARIO_USUARIO_LECTURA)
   @Get(':usuarioId/amigos')
   async findamigosByusuarioId(@Param('usuarioId') usuarioId: string){
       return await this.usuarioUsuarioService.findamigosByusuarioId(usuarioId);
   }

   @Roles(Role.USUARIO_USUARIO_ADMIN, Role.USUARIO_USUARIO_ESCRITURA)
   @Put(':usuarioId/amigos')
   async associateAmigosUsuario(@Body() usuariosDto: UsuarioDto[], @Param('usuarioId') usuarioId: string){
       const amigos = plainToInstance(UsuarioEntity, usuariosDto)
       return await this.usuarioUsuarioService.associateAmigosUsuario(usuarioId, amigos);
   }

   @Roles(Role.USUARIO_USUARIO_ADMIN, Role.USUARIO_USUARIO_ELIMINACION)
   @Delete(':usuarioId/amigos/:amigoId')
    @HttpCode(204)
   async deleteAmigoUsuario(@Param('usuarioId') usuarioId: string, @Param('amigoId') amigoId: string){
       return await this.usuarioUsuarioService.deleteAmigoUsuario(usuarioId, amigoId);
   }    



}
