import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegaloEntity } from 'src/regalo/regalo.entity';
import { Role } from 'src/user/roles/role.enum';
import { Roles } from 'src/user/roles/roles.decorator';
import { RolesGuard } from 'src/user/roles/roles.guard';
import { RegaloDto } from '../regalo/regalo.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaRegaloService } from './categoria-regalo.service';

@Controller('categorias')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaRegaloController {
    constructor(private readonly categoriaRegaloService: CategoriaRegaloService){}

    @Post(':categoriaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CATEGORIA_REGALO_ADMIN, Role.CATEGORIA_REGALO_ESCRITURA)
    async addRegaloCategoria(@Param('categoriaId') categoriaId: string, @Param('regaloId') regaloId: string){
        return await this.categoriaRegaloService.addRegaloCategoria(categoriaId, regaloId);
    }

    @Get(':categoriaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CATEGORIA_REGALO_ADMIN, Role.CATEGORIA_REGALO_LECTURA)
    async findRegaloByCategoriaIdRegaloId(@Param('categoriaId') categoriaId: string, @Param('regaloId') regaloId: string){
        return await this.categoriaRegaloService.findRegaloByCategoriaIdRegaloId(categoriaId, regaloId);
    }

    @Get(':categoriaId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CATEGORIA_REGALO_ADMIN, Role.CATEGORIA_REGALO_LECTURA)
    async findRegalosByCategoriaId(@Param('categoriaId') categoriaId: string){
        return await this.categoriaRegaloService.findRegalosByCategoriaId(categoriaId);
    }

    @Put(':categoriaId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CATEGORIA_REGALO_ADMIN, Role.CATEGORIA_REGALO_ESCRITURA)
    async associateRegalosCategoria(@Body() regalosDto: RegaloDto[], @Param('categoriaId') categoriaId: string){
        const regalos = plainToInstance(RegaloEntity, regalosDto)
        return await this.categoriaRegaloService.associateRegalosCategoria(categoriaId, regalos);
    }
    
    @Delete(':categoriaId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CATEGORIA_REGALO_ADMIN, Role.CATEGORIA_REGALO_ELIMINACION)
    @HttpCode(204)
    async deleteRegaloCategoria(@Param('categoriaId') categoriaId: string, @Param('regaloId') regaloId: string){
        return await this.categoriaRegaloService.deleteRegaloCategoria(categoriaId, regaloId);
    }
}