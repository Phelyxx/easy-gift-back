import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloDto } from '../regalo/regalo.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { WishlistRegaloService } from './wishlist-regalo.service';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../user/roles/roles.guard';
import { Roles } from '../user/roles/roles.decorator';
import { Role } from '../user/roles/role.enum';

@Controller('wishlists')
@UseInterceptors(BusinessErrorsInterceptor)
export class WishlistRegaloController {
    /**
     * Constructor del controlador para la asociacion Wishlist-Regalo
     * @param wishlistRegaloService el servicio correspondiente a la asociacion wishlist-regalo
     */
    constructor(private readonly wishlistRegaloService: WishlistRegaloService){}

    /**
     * Agrega un regalo a una wishlist llamando al metodo de la logica
     * @param wishlistId el id de la wishlist al que se agrega un regalo
     * @param regaloId el id del regalo a agregar
     * @returns la wishlist con el nuevo regalo agregado
     */
    @Post(':wishlistId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_REGALO_ADMIN, Role.WISHLIST_REGALO_ESCRITURA)
    async addRegaloWishlist(@Param('wishlistId') wishlistId: string, @Param('regaloId') regaloId: string){
        return await this.wishlistRegaloService.addRegaloWishlist(wishlistId, regaloId);
    }

    /**
     * Busca un regalo de una wishlist llamando al metodo de la logica
     * @param wishlistId el id de la wishlist para el que se quiere encontrar el regalo
     * @param regaloId el id del regalo a buscar
     * @returns el regalo que se esta buscando
     */
    @Get(':wishlistId/regalos/:regaloId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_REGALO_ADMIN, Role.WISHLIST_REGALO_LECTURA)
    async findRegaloByWishlistIdRegaloId(@Param('wishlistId') wishlistId: string, @Param('regaloId') regaloId: string){
        return await this.wishlistRegaloService.findRegaloByWishlistIdRegaloId(wishlistId, regaloId);
    }

    /**
     * Busca los regalos de una wishlist llamando al metodo de la logica
     * @param wishlistId el id de la wishlist para la que se buscan los regalos
     * @returns los regalos de la wishlist deseada
     */
    @Get(':wishlistId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_REGALO_ADMIN, Role.WISHLIST_REGALO_LECTURA)
    async findRegalosByWishlistId(@Param('wishlistId') wishlistId: string){
        return await this.wishlistRegaloService.findRegalosByWishlistId(wishlistId);
    }

    /**
     * Actualiza los regalos de una wishlist determinada
     * @param regalosDto arreglo de DTOs de regalos que se buscan poner a una nueva wishlist
     * @param wishlistId la wishlist a la que se le actualizaran los regalos
     * @returns la wishlist con los regalos actualizados
     */
    @Put(':wishlistId/regalos')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_REGALO_ADMIN, Role.WISHLIST_REGALO_ESCRITURA)
    async associateRegalosWishlist(@Body() regalosDto: RegaloDto[], @Param('wishlistId') wishlistId: string){
        const regalos = plainToInstance(RegaloEntity, regalosDto)
        return await this.wishlistRegaloService.associateRegalosWishlist(wishlistId, regalos);
    }
    
    /**
     * Elimina un regalo de una wishlist llamando al metodo de la logica. Retorna un codigo 204 si la ejecucion
     * es exitosa.
     * @param wishlistId el id de la wishlist a la que se eliminara un regalo
     * @param regaloId el id del regalo a eliminar
     * @returns Wishlist sin el regalo
     */
    @Delete(':wishlistId/regalos/:regaloId')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.WISHLIST_REGALO_ADMIN, Role.WISHLIST_REGALO_ELIMINACION)
    async deleteRegaloWishlist(@Param('wishlistId') wishlistId: string, @Param('regaloId') regaloId: string){
        return await this.wishlistRegaloService.deleteRegaloWishlist(wishlistId, regaloId);
    }
}
