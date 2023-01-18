import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { WishlistEntity } from './wishlist.entity';

@Injectable()
export class WishlistService {
    /**
     * Constructor del metodo del servicio de wishlist
     * @param wishlistRepository Referencia al repositorio de la wishlist
     */
    constructor(
        @InjectRepository(WishlistEntity)
        private readonly wishlistRepository: Repository<WishlistEntity>
    ){}

    /**
     * Promesa que retorna todas las wishlists.
     * @returns Retorna una lista con todas las wishlists (y sus regalos correspondientes).
     */
    async findAll(): Promise<WishlistEntity[]> {
        return await this.wishlistRepository.find({ relations: ["regalos"] });
    }

    /**
     * Promesa que retorna una wishlist con un id determinado. En caso de no encontrarla, arroja una excepcion de logica de negocio. 
     * @param id de la wishlist que quiere retornarse
     * @returns La wishlist correspondiente al id dado por parametro
     */
    async findOne(id: string): Promise<WishlistEntity> {
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id}, relations: ["regalos"] } );
        if (!wishlist)
          throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
   
        return wishlist;
    }

    /**
     * Crea una wishlist
     * @param wishlist la wishlist a ser creada
     * @returns si se guardo exitosamente, salva la wishlist
     */
    async create(wishlist: WishlistEntity): Promise<WishlistEntity> {
        // No pueden crearse dos wishlists con el mismo nombre
        return await this.wishlistRepository.save(wishlist);
    }

    /**
     * Actualiza una wishlist de un id determinado, con los datos de la wishlist por parametro
     * @param id de la wishlist a actualizar
     * @param wishlist los nuevos datos que se le asignaran a la wishlist
     * @returns si se actualizo correctamente, actualiza la wishlist
     */
    async update(id: string, wishlist: WishlistEntity): Promise<WishlistEntity> {
        const persistedWishlist: WishlistEntity = await this.wishlistRepository.findOne({where:{id}});
        if (!persistedWishlist)
          throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        return await this.wishlistRepository.save({...persistedWishlist, ...wishlist});
    }

    /**
     * Elimina una wishlist determinada, dado su id
     * @param id de la wishlist a eliminar
     */
    async delete(id: string) {
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where:{id}});
        if (!wishlist)
          throw new BusinessLogicException("La wishlist con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        await this.wishlistRepository.remove(wishlist);
    }
}
