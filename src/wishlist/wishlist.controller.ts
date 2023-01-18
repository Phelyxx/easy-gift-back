import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../user/roles/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { WishlistDto } from './wishlist.dto';
import { WishlistEntity } from './wishlist.entity';
import { WishlistService } from './wishlist.service';
import { Role } from '../user/roles/role.enum';
import { Roles } from '../user/roles/roles.decorator';

@Controller('wishlists')
@UseInterceptors(BusinessErrorsInterceptor)
export class WishlistController {
    /**
     * Constructor del controlador de la wishlist
     * @param wishlistService el servicio inyectado de la wishlist
     */
    constructor(private readonly wishlistService: WishlistService) {}

    /**
     * Este metodo llama al metodo de encontrar todas las wishlists del servicio de wishlist
     * @returns todas las wishlists
     */
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_ADMIN, Role.WISHLIST_LECTURA)
    async findAll() {
        return await this.wishlistService.findAll();
    }

    /**
     * Llama al metodo de findOne en la logica para obtener la wishlist que se desea obtener
     * @param wishlistId el id de la wishlist en especifico que busca obtenerse
     * @returns la wishlist deseada
     */
    @Get(':wishlistId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_ADMIN, Role.WISHLIST_LECTURA)
    async findOne(@Param('wishlistId') wishlistId: string) {
        return await this.wishlistService.findOne(wishlistId);
    }

    /**
     * Llama al metodo create en la logica para crear la wishlist que viene por parametro
     * @param wishlistDto el DTO de la wishlist que se guardara, que viene en la peticion
     * @returns la wishlist creada
     */
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_ADMIN, Role.WISHLIST_ESCRITURA)
    async create(@Body() wishlistDto: WishlistDto) {
        const wishlist: WishlistEntity = plainToInstance(WishlistEntity, wishlistDto);
        return await this.wishlistService.create(wishlist);
    }

    /**
     * Actualiza una wishlist, llamando al metodo update de la logica
     * @param wishlistId el id de la wishlist que se va a modificar
     * @param wishlistDto el DTO de la wishlist con los campos a actualizar
     * @returns la wishlist actualizada
     */
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_ADMIN, Role.WISHLIST_ESCRITURA)
    @Put(':wishlistId')
    async update(@Param('wishlistId') wishlistId: string, @Body() wishlistDto: WishlistDto) {
        const wishlist: WishlistEntity = plainToInstance(WishlistEntity, wishlistDto);
        return await this.wishlistService.update(wishlistId, wishlist);
    }

    /**
     * Elimina una wishlist llamando al metodo delete de la logica. Responde con el codigo 204.
     * @param wishlistId el id de la wishlist a eliminar
     * @returns la wishlist eliminada
     */
    @Delete(':wishlistId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_ADMIN, Role.WISHLIST_ELIMINACION)
    async delete(@Param('wishlistId') wishlistId: string) {
        return await this.wishlistService.delete(wishlistId);
    }
}
