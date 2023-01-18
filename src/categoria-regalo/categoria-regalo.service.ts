import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CategoriaRegaloService {
   constructor(
       @InjectRepository(CategoriaEntity)
       private readonly categoriaRepository: Repository<CategoriaEntity>,
   
       @InjectRepository(RegaloEntity)
       private readonly regaloRepository: Repository<RegaloEntity>
   ) {}

   async addRegaloCategoria(categoriaId: string, regaloId: string): Promise<CategoriaEntity> {
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND);
     
       const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}, relations: ["regalos"]})
       if (!categoria)
         throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND);
   
       categoria.regalos = [...categoria.regalos, regalo];
       return await this.categoriaRepository.save(categoria);
     }
   
   async findRegaloByCategoriaIdRegaloId(categoriaId: string, regaloId: string): Promise<RegaloEntity> {
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
      
       const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}, relations: ["regalos"]});
       if (!categoria)
         throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
  
       const categoriaRegalo: RegaloEntity = categoria.regalos.find(e => e.id === regalo.id);
  
       if (!categoriaRegalo)
         throw new BusinessLogicException("The regalo with the given id is not associated to the categoria", BusinessError.PRECONDITION_FAILED)
  
       return categoriaRegalo;
   }
   
   async findRegalosByCategoriaId(categoriaId: string): Promise<RegaloEntity[]> {
       const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}, relations: ["regalos"]});
       if (!categoria)
         throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
      
       return categoria.regalos;
   }
   
   async associateRegalosCategoria(categoriaId: string, regalos: RegaloEntity[]): Promise<CategoriaEntity> {
       const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}, relations: ["regalos"]});
   
       if (!categoria)
         throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < regalos.length; i++) {
         const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regalos[i].id}});
         if (!regalo)
           throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       categoria.regalos = regalos;
       return await this.categoriaRepository.save(categoria);
     }
   
   async deleteRegaloCategoria(categoriaId: string, regaloId: string){
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
   
       const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}, relations: ["regalos"]});
       if (!categoria)
         throw new BusinessLogicException("The categoria with the given id was not found", BusinessError.NOT_FOUND)
   
       const categoriaRegalo: RegaloEntity = categoria.regalos.find(e => e.id === regalo.id);
   
       if (!categoriaRegalo)
           throw new BusinessLogicException("The regalo with the given id is not associated to the categoria", BusinessError.PRECONDITION_FAILED)

       categoria.regalos = categoria.regalos.filter(e => e.id !== regaloId);
       await this.categoriaRepository.save(categoria);
   }  
}