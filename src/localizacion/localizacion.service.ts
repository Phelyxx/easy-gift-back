import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { LocalizacionEntity } from './localizacion.entity';

@Injectable()
export class LocalizacionService {
   constructor(
       @InjectRepository(LocalizacionEntity)
       private readonly localizacionRepository: Repository<LocalizacionEntity>
   ){}

   async findAll(): Promise<LocalizacionEntity[]> {
       return await this.localizacionRepository.find({ relations: ["tienda", "usuario"] });
   }

   async findOne(id: string): Promise<LocalizacionEntity> {
       const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id}, relations: ["tienda", "usuario"] } );
       if (!localizacion)
         throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND);
  
       return localizacion;
   }
  
   async create(localizacion: LocalizacionEntity): Promise<LocalizacionEntity> {
       return await this.localizacionRepository.save(localizacion);
   }

   async update(id: string, localizacion: LocalizacionEntity): Promise<LocalizacionEntity> {
       const persistedLocalizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where:{id}});
       if (!persistedLocalizacion)
         throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND);
      
       localizacion.id = id; 
      
       return await this.localizacionRepository.save(localizacion);
   }

   async delete(id: string) {
       const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where:{id}});
       if (!localizacion)
         throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND);
    
       await this.localizacionRepository.remove(localizacion);
   }
}