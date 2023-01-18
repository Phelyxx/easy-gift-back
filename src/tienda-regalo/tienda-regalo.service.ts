import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TiendaRegaloService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>,
     
        @InjectRepository(RegaloEntity)
        private readonly regaloRepository: Repository<RegaloEntity>
    ) {}

    async addRegaloTienda(tiendaId: string, regaloId: string): Promise<TiendaEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
          throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND);
       
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["regalos", "ubicacion"]}) 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND);
     
        tienda.regalos = [...tienda.regalos, regalo];
        return await this.tiendaRepository.save(tienda);
      }
     
    async findRegaloByTiendaIdRegaloId(tiendaId: string, regaloId: string): Promise<RegaloEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
          throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
        
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["regalos"]}); 
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
    
        const tiendaRegalo: RegaloEntity = tienda.regalos.find(e => e.id === regalo.id);
    
        if (!tiendaRegalo)
          throw new BusinessLogicException("The regalo with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)
    
        return tiendaRegalo;
    }
     
    async findRegalosByTiendaId(tiendaId: string): Promise<RegaloEntity[]> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["regalos"]});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
        
        return tienda.regalos;
    }
     
    async associateRegalosTienda(tiendaId: string, regalos: RegaloEntity[]): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["regalos"]});
     
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        for (let i = 0; i < regalos.length; i++) {
          const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regalos[i].id}});
          if (!regalo)
            throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
        }
     
        tienda.regalos = regalos;
        return await this.tiendaRepository.save(tienda);
      }
     
    async deleteRegaloTienda(tiendaId: string, regaloId: string){
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
        if (!regalo)
          throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
     
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}, relations: ["regalos"]});
        if (!tienda)
          throw new BusinessLogicException("The tienda with the given id was not found", BusinessError.NOT_FOUND)
     
        const tiendaRegalo: RegaloEntity = tienda.regalos.find(e => e.id === regalo.id);
     
        if (!tiendaRegalo)
            throw new BusinessLogicException("The regalo with the given id is not associated to the tienda", BusinessError.PRECONDITION_FAILED)

        tienda.regalos = tienda.regalos.filter(e => e.id !== regaloId);
        await this.tiendaRepository.save(tienda);
    }   
}