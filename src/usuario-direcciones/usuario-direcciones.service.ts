import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class UsuarioDireccionesService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,
     
        @InjectRepository(LocalizacionEntity)
        private readonly localizacionRepository: Repository<LocalizacionEntity>
    ) {}

    async addLocalizacionUsuario(usuarioId: string, localizacionId: string): Promise<UsuarioEntity> {
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND);
       
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]}) 
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
     
        usuario.direcciones = [...usuario.direcciones, localizacion];
        return await this.usuarioRepository.save(usuario);
      }
     
    async findLocalizacionByUsuarioIdLocalizacionId(usuarioId: string, localizacionId: string): Promise<LocalizacionEntity> {
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
        
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones"]}); 
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
    
        const usuarioLocalizacion: LocalizacionEntity = usuario.direcciones.find(e => e.id === localizacion.id);
    
        if (!usuarioLocalizacion)
          throw new BusinessLogicException("The localizacion with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)
    
        return usuarioLocalizacion;
    }
     
    async findLocalizacionsByUsuarioId(usuarioId: string): Promise<LocalizacionEntity[]> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones"]});
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
        
        return usuario.direcciones;
    }
     
    async associateLocalizacionsUsuario(usuarioId: string, direcciones: LocalizacionEntity[]): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones"]});
     
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < direcciones.length; i++) {
          const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: direcciones[i].id}});
          if (!localizacion)
            throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        usuario.direcciones = direcciones;
        return await this.usuarioRepository.save(usuario);
      }
     
    async deleteLocalizacionUsuario(usuarioId: string, localizacionId: string){
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
     
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["direcciones"]});
        if (!usuario)
          throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
     
        const usuarioLocalizacion: LocalizacionEntity = usuario.direcciones.find(e => e.id === localizacion.id);
     
        if (!usuarioLocalizacion)
            throw new BusinessLogicException("The localizacion with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)

        usuario.direcciones = usuario.direcciones.filter(e => e.id !== localizacionId);
        await this.usuarioRepository.save(usuario);
    }   
}