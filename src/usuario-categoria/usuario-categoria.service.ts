/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';

@Injectable()
export class UsuarioCategoriaService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>,

        @InjectRepository(CategoriaEntity) 
        private readonly categoriaRepository: Repository<CategoriaEntity>

        ){}

        
        async addCategoriaUsuario(usuarioId: string, categoriaId: string):Promise<UsuarioEntity>{
            const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{id : categoriaId}});
            if (!categoria)
                throw new BusinessLogicException("La categoria con el id dado no existe", BusinessError.NOT_FOUND);

            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["intereses"]})
            if (!usuario)
                throw new BusinessLogicException("El usuario con el id dado no existe", BusinessError.NOT_FOUND);
            
            usuario.intereses= [...usuario.intereses, categoria]
            return await this.usuarioRepository.save(usuario);
        }

        async findCategoriaByUsuarioIdCategoriaId(usuarioId: string, categoriaId: string): Promise<CategoriaEntity>{
            const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where:{id : categoriaId}});
            if (!categoria)
                throw new BusinessLogicException("La categoria con el id dado no existe", BusinessError.NOT_FOUND)
            
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["intereses"]});
            if (!usuario)
                throw new BusinessLogicException("El usuario con el id dado no existe", BusinessError.NOT_FOUND)
        
            const usuarioCategoria: CategoriaEntity = usuario.intereses.find(e => e.id === categoria.id);
        
            if (!usuarioCategoria)
                throw new BusinessLogicException("La categoria con el id dado no esta asociada al usuario", BusinessError.PRECONDITION_FAILED)
        
            return usuarioCategoria;
        }

        async findCategoriasByUsuarioId(usuarioId: string): Promise<CategoriaEntity[]> {
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["intereses"]});
            if (!usuario)
              throw new BusinessLogicException("El usuario con el id dado no existe", BusinessError.NOT_FOUND)
           
            return usuario.intereses;
        }


        async associateCategoriaUsuario(usuarioId: string, categoria: CategoriaEntity[]): Promise<UsuarioEntity> {
           const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["intereses"]});
            if (!usuario)
              throw new BusinessLogicException("El usuario con el id dado no existe", BusinessError.NOT_FOUND)
        
            for (let i = 0; i < categoria.length; i++) {
              const resena: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoria[i].id}});
              if (!resena)
                throw new BusinessLogicException("La categoria con el id dado no existe", BusinessError.NOT_FOUND)
            }
        
            usuario.intereses = categoria;
            return await this.usuarioRepository.save(usuario);
          }

        async deleteCategoriaUsuario(usuarioId: string, categoriaId: string){
            const resena: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}});
            if (!resena)
              throw new BusinessLogicException("La categoria con el id dado no existe", BusinessError.NOT_FOUND)
        
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["intereses"]});
            if (!usuario)
              throw new BusinessLogicException("El usuario con el id dado no existe", BusinessError.NOT_FOUND)
        
            const usuarioCategoria: CategoriaEntity = usuario.intereses.find(e => e.id === resena.id);
        
            if (!usuarioCategoria)
                throw new BusinessLogicException("La categoria con el id dado no esta asociada al usuario", BusinessError.PRECONDITION_FAILED)
     
            usuario.intereses = usuario.intereses.filter(e => e.id !== categoriaId);
            await this.usuarioRepository.save(usuario);
        }  


}
