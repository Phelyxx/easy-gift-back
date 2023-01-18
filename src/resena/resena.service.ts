/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException }  from '../shared/errors/business-errors'




@Injectable()
export class ResenaService {
    constructor(
        @InjectRepository(ResenaEntity)
        private readonly resenaRepositoy: Repository<ResenaEntity>
    ){}


    async findAll(): Promise<ResenaEntity[]>{
        return await this.resenaRepositoy.find({relations: ["regalo", "usuario"]})
    }

    async findOne(id: string): Promise<ResenaEntity> {
        const resena: ResenaEntity = await this.resenaRepositoy.findOne({where: {id}, relations: ["regalo", "usuario"] } );
        if (!resena)
            throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND);
  

        return resena;
    }

    async create(resena: ResenaEntity): Promise<ResenaEntity> {
        return await this.resenaRepositoy.save(resena);
    }

    async update(id: string, resena: ResenaEntity): Promise<ResenaEntity> {
        const persistedResene: ResenaEntity = await this.resenaRepositoy.findOne({where:{id}});
        if(!persistedResene)
            throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
        return await this.resenaRepositoy.save({...persistedResene, ...resena});
    }

    async delete(id:string){
        const resena: ResenaEntity = await this.resenaRepositoy.findOne({where:{id}});
        if(!resena)
            throw new BusinessLogicException("The resena with the given id was not found", BusinessError.NOT_FOUND)
        await this. resenaRepositoy.remove(resena);
    }



}
/* archivo: src/resena/resena.service.ts */

