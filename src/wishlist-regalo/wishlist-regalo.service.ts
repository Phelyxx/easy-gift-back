import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistRegaloService {
    /**
     * Constructor del servicio para la relacion Wishlist-Regalo.
     * @param wishlistRepository el repositorio de la wishlist
     * @param regaloRepository el repositorio del regalo
     */
    constructor(
        @InjectRepository(WishlistEntity)
        private readonly wishlistRepository: Repository<WishlistEntity>,
     
        @InjectRepository(RegaloEntity)
        private readonly regaloRepository: Repository<RegaloEntity>
    ) {}

    /**
     * Este metodo agrega un regalo determinado a una wishlist determinada
     * @param wishlistId la wishlist a la que se agregara un regalo
     * @param regaloId el id del regalo que se agregara a la wishlist
     * @throws BusinessLogicException si el regalo o la wishlist no fueron encontrados
     * @returns la wishlist con el nuevo regalo agregado
     */
    async addRegaloWishlist(wishlistId: string, regaloId: string): Promise<WishlistEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
            throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}, relations: ["regalos"]})
        if (!wishlist)
            throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        wishlist.regalos = [...wishlist.regalos, regalo];
        return await this.wishlistRepository.save(wishlist);
      }
    
    /**
     * Este metodo busca un regalo determinado de una wishlist determinada
     * @param wishlistId el id de la wishlist de la que se quiere encontrar el regalo
     * @param regaloId el id del regalo que se quiere encontrar
     * @throws BusinessLogicException si el regalo o la wishlist no fueron encontrados, o si el regalo con el id dado
     * no se encuentra asociado a la wishlist
     * @returns el regalo de la wishlist a buscar
     */
    async findRegaloByWishlistIdRegaloId(wishlistId: string, regaloId: string): Promise<RegaloEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
            throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
       
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}, relations: ["regalos"]});
        if (!wishlist)
            throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
   
        const wishlistRegalo: RegaloEntity = wishlist.regalos.find(e => e.id === regalo.id);
   
        if (!wishlistRegalo)
            throw new BusinessLogicException("El regalo con el ID dado no se encuentra asociado a la wishlist", BusinessError.PRECONDITION_FAILED)
   
        return wishlistRegalo;
    }
    
    /**
     * Este metodo encuentra todos los regalos de una wishlist determinada
     * @param wishlistId la wishlist de la que se quieren encontrar los regalos
     * @returns los regalos de la wishlist
     */
    async findRegalosByWishlistId(wishlistId: string): Promise<RegaloEntity[]> {
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}, relations: ["regalos"]});
        if (!wishlist)
            throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
       
        return wishlist.regalos;
    }
    
    /**
     * Este metodo remplaza los regalos de una wishlist con los que vienen por parametro, siempre y cuando la wishlist
     * exista y los regalos existan en el repositorio.
     * @param wishlistId la wishlist de la que se quieren cambiar los regalos
     * @param regalos los nuevos regalos a hacer asociados con la wishlist
     * @throws BusinessLogicException si la wishlist o el regalo con los IDs dados no fueron encontrados
     * @returns la wishlist actualizada con los nuevos regalos
     */
    async associateRegalosWishlist(wishlistId: string, regalos: RegaloEntity[]): Promise<WishlistEntity> {
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}, relations: ["regalos"]});
    
        if (!wishlist)
            throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < regalos.length; i++) {
            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regalos[i].id}});
            if (!regalo)
                throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        wishlist.regalos = regalos;
        return await this.wishlistRepository.save(wishlist);
      }
    
    /**
     * Este metodo elimina un regalo de una lista, siempre y cuando el regalo con el ID dado exista, la wishlist tambien, y
     * el regalo este asociado a la wishlist
     * @param wishlistId el id de la wishlist a la que se quiere eliminar el regalo
     * @param regaloId el id del regalo a eliminar
     * @throws BusinessLogicException si el regalo o la wishlist no fueron encontrados, o si el regalo con el ID dado no se
     * encuentra asociado a la wishlist 
     */
    async deleteRegaloWishlist(wishlistId: string, regaloId: string){
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
            throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}, relations: ["regalos"]});
        if (!wishlist)
            throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const wishlistRegalo: RegaloEntity = wishlist.regalos.find(e => e.id === regalo.id);
    
        if (!wishlistRegalo)
            throw new BusinessLogicException("El regalo con el ID dado no se encuentra asociado a la wishlist", BusinessError.PRECONDITION_FAILED)
 
        wishlist.regalos = wishlist.regalos.filter(e => e.id !== regaloId);
        await this.wishlistRepository.save(wishlist);
    } 
}
