/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from '../resena/resena.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';


@Injectable()
export class ResenaUsuarioService {
    constructor(
        @InjectRepository(ResenaEntity)
        private readonly resenaRepository: Repository<ResenaEntity>,

        @InjectRepository(UsuarioEntity) 
        private readonly usuarioRepository: Repository<UsuarioEntity>

        ){}
        

        async addResenaUsuario(usuarioId: string, resenaId: string):Promise<UsuarioEntity>{
            const resena: ResenaEntity = await this.resenaRepository.findOne({where:{id : resenaId}});
            if (!resena)
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND);

            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["resenas"]})
            if (!usuario)
                throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND);
            
            usuario.resenas= [...usuario.resenas, resena]
            return await this.usuarioRepository.save(usuario);
        }

        async findResenaByUsuarioIdResenaID(usuarioId: string, resenaid: string): Promise<ResenaEntity>{
            const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenaid}});
            if (!resena) 
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
            
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["resenas"]});
            if (!usuario)
                throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
        
            const usuarioResena: ResenaEntity = usuario.resenas.find(e => e.id === resena.id);
        
            if (!usuarioResena)
                throw new BusinessLogicException("The resena with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)
        
            return usuarioResena;
        }

        async findResenasByUsuarioId(usuarioId: string): Promise<ResenaEntity[]> {
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["resenas"]});
            if (!usuario)
              throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
           
            return usuario.resenas;
        }


        async associateResenaUsuario(usuarioId: string, resenas: ResenaEntity[]): Promise<UsuarioEntity> {
           const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["resenas"]});
            if (!usuario)
              throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
        
            for (let i = 0; i < resenas.length; i++) {
              const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenas[i].id}});
              if (!resena)
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
            }
        
            usuario.resenas = resenas;
            return await this.usuarioRepository.save(usuario);
          }

        async deleteResenaUsuario(usuarioId: string, resenaId: string){
            const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenaId}});
            if (!resena)
              throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
        
            const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id: usuarioId}, relations: ["resenas"]});
            if (!usuario)
              throw new BusinessLogicException("The usuario with the given id was not found", BusinessError.NOT_FOUND)
        
            const usuarioResena: ResenaEntity = usuario.resenas.find(e => e.id === resena.id);
        
            if (!usuarioResena)
                throw new BusinessLogicException("The resena with the given id is not associated to the usuario", BusinessError.PRECONDITION_FAILED)
     
            usuario.resenas = usuario.resenas.filter(e => e.id !== resenaId);
            await this.usuarioRepository.save(usuario);
        }   

    }
