import { Injectable } from '@nestjs/common';
import { TiendaEntity } from '../tienda/tienda.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RegaloTiendaService {
    /**
     * Constructor del servicio para la asociacion Regalo-Tienda
     * @param regaloRepository el repositorio del regalo
     * @param tiendaRepository el repositorio de la tienda
     */
    constructor(
        @InjectRepository(RegaloEntity)
        private readonly regaloRepository: Repository<RegaloEntity>,
    
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ) {}

    /**
     * Agrega una tienda a un regalo
     * @param regaloId el id del regalo al que se le agregara una tienda
     * @param tiendaId el id de la tienda a agregar
     * @throws BusinessLogicException si la tienda o el regalo con los IDs dados no fueron encontrados
     * @returns el regalo con la nueva tienda donde sera vendido
     */
    async addTiendaRegalo(regaloId: string, tiendaId: string): Promise<RegaloEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["tiendas", "categorias", "resenas"]})
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        regalo.tiendas = [...regalo.tiendas, tienda];
        return await this.regaloRepository.save(regalo);
      }
    
    /**
     * Busca una tienda a partir de su ID donde se vende un regalo determinado (con un ID especifico)
     * @param regaloId el id del regalo para el que se busca una tienda
     * @param tiendaId el id de la tienda que se quiere encontrar
     * @throws BusinessLogicException si la tienda o el regalo con los IDs dados no fueron encontrados, o si la tienda no se
     * encuentra asociada al regalo
     * @returns la tienda correspondiente al regalo determinado
     */
    async findTiendaByRegaloIdTiendaId(regaloId: string, tiendaId: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
       
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["tiendas"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
   
        const regaloTienda: TiendaEntity = regalo.tiendas.find(e => e.id === tienda.id);
   
        if (!regaloTienda)
          throw new BusinessLogicException("La tienda con el ID dado no se encuentra asociada al regalo", BusinessError.PRECONDITION_FAILED)
   
        return regaloTienda;
    }
    
    /**
     * Retorna las tiendas de un regalo determinado
     * @param regaloId el id del regalo para el cual se buscan todas sus tiendas
     * @throws BusinessLogicException si el regalo con el ID dado no fue encontrado
     * @returns las tiendas de un regalo determinado
     */
    async findTiendasByRegaloId(regaloId: string): Promise<TiendaEntity[]> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["tiendas"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
       
        return regalo.tiendas;
    }
    
    /**
     * Actualiza (remplaza) las tiendas de un regalo determinado
     * @param regaloId el id del regalo al que se le cambiaran las tiendas
     * @param tiendas las tiendas a actualizar para un regalo determinado
     * @throws BusinessLogicException si el regalo o la tienda con los IDs dados no fueron encontrados
     * @returns El regalo con las nuevas tiendas
     */
    async associateTiendasRegalo(regaloId: string, tiendas: TiendaEntity[]): Promise<RegaloEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["tiendas"]});
    
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < tiendas.length; i++) {
          const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendas[i].id}});
          if (!tienda)
            throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        }
    
        regalo.tiendas = tiendas;
        return await this.regaloRepository.save(regalo);
      }
    
    /**
     * Elimina una tienda especifica de un regalo determinado
     * @param regaloId el id del regalo al que se va a eliminar una tienda
     * @param tiendaId la tienda a eliminar para el regalo
     * @throws BusinessLogicException si la tienda o el regalo con los IDs dados no fueron encontrados, o si la tienda no se
     * encuentra asociada al regalo
     */
    async deleteTiendaRegalo(regaloId: string, tiendaId: string){
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id: tiendaId}});
        if (!tienda)
          throw new BusinessLogicException("La tienda con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["tiendas"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const regaloTienda: TiendaEntity = regalo.tiendas.find(e => e.id === tienda.id);
    
        if (!regaloTienda)
            throw new BusinessLogicException("La tienda con el ID dado no se encuentra asociada al regalo", BusinessError.PRECONDITION_FAILED)
 
        regalo.tiendas = regalo.tiendas.filter(e => e.id !== tiendaId);
        await this.regaloRepository.save(regalo);
    }  
}
