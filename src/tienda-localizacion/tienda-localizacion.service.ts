


import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaLocalizacionService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
     
        @InjectRepository(LocalizacionEntity)
        private readonly localizacionRepository: Repository<LocalizacionEntity>
    ) {}

    async addLocalizacionTienda(tiendaId: string, localizacionId: string): Promise<TiendaEntity> {
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND);
       
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["ubicacion", "regalos"]}) 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
     
        tienda.ubicacion =  localizacion;
        return await this.tiendaRepository.save(tienda);
      }
     
    async findLocalizacionByTiendaIdLocalizacionId(tiendaId: string, localizacionId: string): Promise<LocalizacionEntity> {
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
        
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["ubicacion"]}); 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
    
        const tiendaLocalizacion: LocalizacionEntity = tienda.ubicacion;
                       
        if (tiendaLocalizacion.id !== localizacionId)
          throw new BusinessLogicException("The localizacion with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)

     
        return tiendaLocalizacion;
    }
    async findLocalizacionByTiendaId(tiendaId: string): Promise<LocalizacionEntity> {

      const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["ubicacion"]}); 
      if (!tienda)
        throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
  
      const tiendaLocalizacion: LocalizacionEntity = tienda.ubicacion;
                     
      return tiendaLocalizacion;
  }
   
    async associateLocalizacionTienda(tiendaId: string, localizacionId: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["ubicacion"]});
     
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
       
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
         if (!localizacion)
            throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
  
        tienda.ubicacion = localizacion;
        return await this.tiendaRepository.save(tienda);
      }
     

    async deleteLocalizacionTienda(tiendaId: string, localizacionId: string){
        const localizacion: LocalizacionEntity = await this.localizacionRepository.findOne({where: {id: localizacionId}});
        if (!localizacion)
          throw new BusinessLogicException("The localizacion with the given id was not found", BusinessError.NOT_FOUND)
     
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["ubicacion"]});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        const tiendaLocalizacion: LocalizacionEntity = tienda.ubicacion;
     
        if (tiendaLocalizacion.id !== localizacionId)
            throw new BusinessLogicException("The localizacion with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)

        tienda.ubicacion= null;
        await this.tiendaRepository.save(tienda);
    }   
}