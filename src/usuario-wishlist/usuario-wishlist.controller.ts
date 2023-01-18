/* eslint-disable prettier/prettier */
import { Controller, UseInterceptors, UseGuards, Post,Body, Param, Put, Delete, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { WishlistDto } from 'src/wishlist/wishlist.dto';
import { WishlistEntity } from 'src/wishlist/wishlist.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';
import { RolesGuard } from '../user/roles/roles.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { UsuarioWishlistService } from './usuario-wishlist.service';

@Controller('usuarios')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioWishlistController {
    constructor(private readonly usuarioWishlistService: UsuarioWishlistService){}

    @Post(':usuarioId/wishlists/:wishlistId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_WISHLIST_ADMIN, Role.USUARIO_WISHLIST_ESCRITURA)
    async addWishlistUsuario(@Param('usuarioId') usuarioId: string, @Param('wishlistId') wishlistId: string){
        return await this.usuarioWishlistService.addWishlistUsuario(usuarioId,wishlistId);
    }


    @Get(':usuarioId/wishlists/:wishlistId')    
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_WISHLIST_ADMIN, Role.USUARIO_WISHLIST_LECTURA)
    async findWishlistUsuarioIdEishlistId(@Param('usuarioId') usuarioId: string, @Param('wishlistId') wishlistId: string){
        return await this.usuarioWishlistService.findwishlistByUsuarioIdWishlistId(usuarioId,wishlistId);
    }

    @Get(':usuarioId/wishlists')    
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_WISHLIST_ADMIN, Role.USUARIO_WISHLIST_LECTURA)
    async findWishlistByUsuarioId(@Param('usuarioId') usuarioId: string){
        return await this.usuarioWishlistService.findWishlistsByUsuarioId(usuarioId);
    }

    @Put(':usuarioId/wishlists')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_WISHLIST_ADMIN, Role.USUARIO_WISHLIST_ESCRITURA)
    async associateWishlistUsuario(@Body() wishlistsDto: WishlistDto[], @Param('usuarioId') usuarioId: string){
        const wishlists = plainToInstance(WishlistEntity, wishlistsDto);
        return await this.usuarioWishlistService.associateWishlistUsuario(usuarioId,wishlists);
    }

    @Delete(':usuarioId/wishlists/:wishlistId')
    @UseGuards(JwtAuthGuard, RolesGuard)   
    @Roles(Role.USUARIO_WISHLIST_ADMIN, Role.USUARIO_WISHLIST_ELIMINACION)
    async deleteWishlistUsuario(@Param('usuarioId') usuarioId: string, @Param('wishlistId') wishlistId: string){
        return await this.usuarioWishlistService.deleteWishlistUsuario(usuarioId,wishlistId);
    }


}
