import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LocalizacionEntity } from 'src/localizacion/localizacion.entity';
import { LocalizacionDto } from '../localizacion/localizacion.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioDireccionesService} from './usuario-direcciones.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioDireccionesController {
    constructor(private readonly usuarioLocalizacionService: UsuarioDireccionesService){}

    @Post(':usuarioId/localizaciones/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USUARIO_DIRECCIONES_ADMIN, Role.USUARIO_DIRECCIONES_ESCRITURA)
    async addLocalizacionUsuario(@Param('usuarioId') usuarioId: string, @Param('localizacionId') localizacionId: string){
        return await this.usuarioLocalizacionService.addLocalizacionUsuario(usuarioId, localizacionId);
    }

    @Get(':usuarioId/localizaciones/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USUARIO_DIRECCIONES_ADMIN, Role.USUARIO_DIRECCIONES_LECTURA)
    async findLocalizacionByUsuarioIdLocalizacionId(@Param('usuarioId') usuarioId: string, @Param('localizacionId') localizacionId: string){
        return await this.usuarioLocalizacionService.findLocalizacionByUsuarioIdLocalizacionId(usuarioId, localizacionId);
    }

    @Get(':usuarioId/localizaciones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USUARIO_DIRECCIONES_ADMIN, Role.USUARIO_DIRECCIONES_LECTURA)
    async findLocalizacionsByUsuarioId(@Param('usuarioId') usuarioId: string){
        return await this.usuarioLocalizacionService.findLocalizacionsByUsuarioId(usuarioId);
    }

    @Put(':usuarioId/localizaciones')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USUARIO_DIRECCIONES_ADMIN, Role.USUARIO_DIRECCIONES_ESCRITURA)
    async associateLocalizacionsUsuario(@Body() localizacionesDto: LocalizacionDto[], @Param('usuarioId') usuarioId: string){
        const localizaciones = plainToInstance(LocalizacionEntity, localizacionesDto)
        return await this.usuarioLocalizacionService.associateLocalizacionsUsuario(usuarioId, localizaciones);
    }
    
    @Delete(':usuarioId/localizaciones/:localizacionId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.USUARIO_DIRECCIONES_ADMIN, Role.USUARIO_DIRECCIONES_ELIMINACION)
    @HttpCode(204)
    async deleteLocalizacionUsuario(@Param('usuarioId') usuarioId: string, @Param('localizacionId') localizacionId: string){
        return await this.usuarioLocalizacionService.deleteLocalizacionUsuario(usuarioId, localizacionId);
    }
}