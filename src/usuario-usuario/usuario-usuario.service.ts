import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioUsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>

    ) {}

    async addAmigousuario(usuarioId: string, amigoId: string): Promise<UsuarioEntity> {
        const amigo: UsuarioEntity= await this.usuarioRepository.findOne({where: {id: amigoId}});
        if (!amigo)
          throw new BusinessLogicException("El amigo con el id dado no fue encontrado", BusinessError.NOT_FOUND);
      
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]})
        if (!usuario)
          throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND);
    
        usuario.amigos = [...usuario.amigos, amigo];
        return await this.usuarioRepository.save(usuario);
      }
    
    async findamigoByusuarioIdamigoId(usuarioId: string, amigoId: string): Promise<UsuarioEntity> {
        const amigo: UsuarioEntity= await this.usuarioRepository.findOne({where: {id: amigoId}});
        if (!amigo)
          throw new BusinessLogicException("El amigo con el id dado no fue encontrado", BusinessError.NOT_FOUND)
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]});
        if (!usuario)
          throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND)
   
        const usuarioamigo: UsuarioEntity= usuario.amigos.find(e => e.id === amigo.id);
   
        if (!usuarioamigo)
          throw new BusinessLogicException("El amigo con el id dado no esta asociado a ese usuario", BusinessError.PRECONDITION_FAILED)
   
        return usuarioamigo;
    }
    
    async findamigosByusuarioId(usuarioId: string): Promise<UsuarioEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]});
        if (!usuario)
          throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND)
       
        return usuario.amigos;
    }
    
    async associateAmigosUsuario(usuarioId: string, amigos: UsuarioEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["amigos"]});
    
        if (!usuario)
          throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < amigos.length; i++) {
          const amigo: UsuarioEntity= await this.usuarioRepository.findOne({where: {id: amigos[i].id}});
          if (!amigo)
            throw new BusinessLogicException("El amigo con el id dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        usuario.amigos = amigos;
        return await this.usuarioRepository.save(usuario);
      }
    
    async deleteAmigoUsuario(usuarioId: string, amigoId: string){
        const amigo: UsuarioEntity= await this.usuarioRepository.findOne({where: {id: amigoId}});
        if (!amigo)
          throw new BusinessLogicException("El amigo con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]});
        if (!usuario)
          throw new BusinessLogicException("El usuario con el id dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const usuarioamigo: UsuarioEntity= usuario.amigos.find(e => e.id === amigo.id);
    
        if (!usuarioamigo)
            throw new BusinessLogicException("El amigo con el id dado no esta asociado al usuario", BusinessError.PRECONDITION_FAILED)
 
        usuario.amigos = usuario.amigos.filter(e => e.id !== amigoId);
        await this.usuarioRepository.save(usuario);
    }







}
