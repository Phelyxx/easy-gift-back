/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioWishlistService {

    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(WishlistEntity) 
        private readonly wishlistRepository: Repository<WishlistEntity>

        ){}


    async addWishlistUsuario(usuarioId: string, wishlistId: string):Promise<UsuarioEntity>{
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where:{id : wishlistId}});
        if (!wishlist)
            throw new BusinessLogicException("The wishlist with the given id was not found", BusinessError.NOT_FOUND);

        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["wishlist"]})
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
        
        usuario.wishlist = [...usuario.wishlist, wishlist]
        return await this.usuarioRepository.save(usuario);
    }

    async findwishlistByUsuarioIdWishlistId(usuarioId: string, wishlistId: string): Promise<WishlistEntity>{
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where:{id : wishlistId}});
        if (!wishlist)
            throw new BusinessLogicException("The wishlist with the given id was not found", BusinessError.NOT_FOUND)
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["wishlist"]});
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
    
        const usuarioWishlist: WishlistEntity = usuario.wishlist.find(e => e.id === wishlist.id);
    
        if (!usuarioWishlist)
            throw new BusinessLogicException("The wishlist with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)
    
        return wishlist;
    }

    async findWishlistsByUsuarioId(usuarioId: string): Promise<WishlistEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["wishlist"]});
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
        
        return usuario.wishlist;
    }


    async associateWishlistUsuario(usuarioId: string, wishlist: WishlistEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["wishlist"]});
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < wishlist.length; i++) {
            const wish: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlist[i].id}});
            if (!wish)
                throw new BusinessLogicException("The wishlist with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        usuario.wishlist = wishlist;
        return await this.usuarioRepository.save(usuario);
        }

    async deleteWishlistUsuario(usuarioId: string, wishlistId: string){
        const wishlist: WishlistEntity = await this.wishlistRepository.findOne({where: {id: wishlistId}});
        if (!wishlist)
            throw new BusinessLogicException("The wishlist with the given id was not found", BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["wishlist"]});
        if (!usuario)
            throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
    
        const usuariowishlist: WishlistEntity = usuario.wishlist.find(e => e.id === wishlist.id);
    
        if (!usuariowishlist)
            throw new BusinessLogicException("The wishlist with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)
    
        usuario.wishlist = usuario.wishlist.filter(e => e.id !== wishlistId);
        await this.usuarioRepository.save(usuario);
    }  


}
