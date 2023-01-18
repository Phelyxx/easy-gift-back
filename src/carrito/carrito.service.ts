import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CarritoEntity } from './carrito.entity';

@Injectable()
export class CarritoService {
   constructor(
       @InjectRepository(CarritoEntity)
       private readonly carritoRepository: Repository<CarritoEntity>
   ){}

   async findAll(): Promise<CarritoEntity[]> {
       return await this.carritoRepository.find({ relations: ["regalos"] });
   }

   async findOne(id: string): Promise<CarritoEntity> {
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where: {id}, relations: ["regalos"] } );
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND);
  
       return carrito;
   }
  
   async create(carrito: CarritoEntity): Promise<CarritoEntity> {
       return await this.carritoRepository.save(carrito);
   }

   async update(id: string, carrito: CarritoEntity): Promise<CarritoEntity> {
       const persistedCarrito: CarritoEntity = await this.carritoRepository.findOne({where:{id}});
       if (!persistedCarrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND);
      
       carrito.id = id; 
      
       return await this.carritoRepository.save(carrito);
   }

   async delete(id: string) {
       const carrito: CarritoEntity = await this.carritoRepository.findOne({where:{id}});
       if (!carrito)
         throw new BusinessLogicException("The carrito with the given id was not found", BusinessError.NOT_FOUND);
    
       await this.carritoRepository.remove(carrito);
   }
}