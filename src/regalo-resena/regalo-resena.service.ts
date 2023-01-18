/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { ResenaEntity } from '../resena/resena.entity';

@Injectable()
export class RegaloResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private readonly resenaRepository: Repository<ResenaEntity>,

        @InjectRepository(RegaloEntity) 
        private readonly regaloRepository: Repository<RegaloEntity>

        ){}


        async addResenaRegalo(regaloId: string, resenaId: string):Promise<RegaloEntity>{
            const resena: ResenaEntity = await this.resenaRepository.findOne({where:{id : resenaId}});
            if (!resena)
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND);

            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["resenas"]})
            if (!regalo)
                throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND);
            
            regalo.resenas= [...regalo.resenas, resena]
            return await this.regaloRepository.save(regalo);
        }

        async findRegaloByRegaloIdResenaID(regaloId: string, resenaid: string): Promise<ResenaEntity>{
            const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenaid}});
            if (!resena)
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
            
            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["resenas"]});
            if (!regalo)
                throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
        
            const regaloResena: ResenaEntity = regalo.resenas.find(e => e.id === resena.id);
        
            if (!regaloResena)
                throw new BusinessLogicException("The resena with the given id is not associated to the regalo", BusinessError.PRECONDITION_FAILED)
        
            return regaloResena;
        }

        async findResenasByRegaloId(regaloId: string): Promise<ResenaEntity[]> {
            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["resenas"]});
            if (!regalo)
              throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
           
            return regalo.resenas;
        }


        async associateResenaRegalo(regaloId: string, resenas: ResenaEntity[]): Promise<RegaloEntity> {
            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["resenas"]});
            if (!regalo)
              throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
        
            for (let i = 0; i < resenas.length; i++) {
              const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenas[i].id}});
              if (!resena)
                throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
            }
        
            regalo.resenas = resenas;
            return await this.regaloRepository.save(regalo);
          }

        async deleteResenaRegalo(regaloId: string, resenaId: string){
            const resena: ResenaEntity = await this.resenaRepository.findOne({where: {id: resenaId}});
            if (!resena )
              throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
        
            const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["resenas"]});
            if (!regalo)
              throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
        
            const regaloResena: ResenaEntity = regalo.resenas.find(e => e.id === resena.id);
        
            if (!regaloResena)
                throw new BusinessLogicException("The resena with the given id is not associated to the regalo", BusinessError.PRECONDITION_FAILED)
     
            regalo.resenas = regalo.resenas.filter(e => e.id !== resenaId);
            await this.regaloRepository.save(regalo);
        }  

}
