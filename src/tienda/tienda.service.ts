import { Injectable } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { TiendaEntity } from './tienda.entity';


@Injectable()
export class TiendaService {
   constructor(
       @InjectRepository(TiendaEntity)
       private readonly tiendaRepository: Repository<TiendaEntity>
   ){}

   async findAll(): Promise<TiendaEntity[]> {
       return await this.tiendaRepository.find({ relations: ["ubicacion", "regalos"] });
   }

   async findOne(id: string): Promise<TiendaEntity> {
       const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ["ubicacion", "regalos"] } );
       if (!tienda)
         throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
  
       return tienda;
   }
  
   async create(tienda: TiendaEntity): Promise<TiendaEntity> {
       return await this.tiendaRepository.save(tienda);
   }

   async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
       const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({where:{id}});
       if (!persistedTienda)
         throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
      
       tienda.id = id; 
      
       return await this.tiendaRepository.save(tienda);
   }

   async delete(id: string) {
       const tienda: TiendaEntity = await this.tiendaRepository.findOne({where:{id}});
       if (!tienda)
         throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
    
       await this.tiendaRepository.remove(tienda);
   }
}