import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { CarritoEntity } from '../carrito/carrito.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
/* eslint-disable prettier/prettier */
export class CarritoRegaloService {
   constructor(
       @InjectRepository(CarritoEntity)
       private readonly carritoRepository: Repository<CarritoEntity>,
   
       @InjectRepository(RegaloEntity)
       private readonly regaloRepository: Repository<RegaloEntity>
   ) {}

   async addRegaloCarrito(carritoId: string, regaloId: string): Promise<CarritoEntity> {
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND);
     
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id: carritoId}, relations: ["regalos"]})
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND);
   
       carrito.regalos = [...carrito.regalos, regalo];
       return await this.carritoRepository.save(carrito);
     }
   
   async findRegaloByCarritoIdRegaloId(carritoId: string, regaloId: string): Promise<RegaloEntity> {
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
      
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id: carritoId}, relations: ["regalos"]});
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND)
  
       const carritoRegalo: RegaloEntity = carrito.regalos.find(e => e.id === regalo.id);
  
       if (!carritoRegalo)
         throw new BusinessLogicException("The regalo with the given id is not associated to the carrito", BusinessError.PRECONDITION_FAILED)
  
       return carritoRegalo;
   }
   
   async findRegalosByCarritoId(carritoId: string): Promise<RegaloEntity[]> {
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id: carritoId}, relations: ["regalos"]});
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND)
      
       return carrito.regalos;
   }
   
   async associateRegalosCarrito(carritoId: string, regalos: RegaloEntity[]): Promise<CarritoEntity> {
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id: carritoId}, relations: ["regalos"]});
   
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < regalos.length; i++) {
         const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regalos[i].id}});
         if (!regalo)
           throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       carrito.regalos = regalos;
       return await this.carritoRepository.save(carrito);
     }
   
   async deleteRegaloCarrito(carritoId: string, regaloId: string){
       const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}});
       if (!regalo)
         throw new BusinessLogicException("The regalo with the given id was not found", BusinessError.NOT_FOUND)
   
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id: carritoId}, relations: ["regalos"]});
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND)
   
       const carritoRegalo: RegaloEntity = carrito.regalos.find(e => e.id === regalo.id);
   
       if (!carritoRegalo)
           throw new BusinessLogicException("The regalo with the given id is not associated to the carrito", BusinessError.PRECONDITION_FAILED)

       carrito.regalos = carrito.regalos.filter(e => e.id !== regaloId);
       await this.carritoRepository.save(carrito);
   }  
}