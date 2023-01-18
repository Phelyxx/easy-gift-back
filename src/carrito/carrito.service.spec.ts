import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CarritoEntity } from './carrito.entity';
import { CarritoService } from './carrito.service';

import { faker } from '@faker-js/faker';
import { UsuarioEntity } from '../usuario/usuario.entity';


describe('CarritoService', () => {
  let service: CarritoService;
  let repository: Repository<CarritoEntity>;
  let carritosList: CarritoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CarritoService],
    }).compile();

    service = module.get<CarritoService>(CarritoService);
    repository = module.get<Repository<CarritoEntity>>(getRepositoryToken(CarritoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    carritosList = [];
    for(let i = 0; i < 5; i++){
        const carrito: CarritoEntity = await repository.save({
        fechaCreacion: faker.date.recent(), 
        })
        carritosList.push(carrito);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all carritos', async () => {
    const carritos: CarritoEntity[] = await service.findAll();
    expect(carritos).not.toBeNull();
    expect(carritos).toHaveLength(carritosList.length);
  });

  it('findOne should return a carrito by id', async () => {
    const storedCarrito: CarritoEntity = carritosList[0];
    const carrito: CarritoEntity = await service.findOne(storedCarrito.id);
    expect(carrito).not.toBeNull();
    expect(carrito.fechaCreacion).toEqual(storedCarrito.fechaCreacion)
  });

  it('findOne should throw an exception for an invalid carrito', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The carrito with the given id was not found")
  });

  it('create should return a new carrito', async () => {
    const carrito: CarritoEntity = {
      id: "",
      fechaCreacion: faker.date.recent(),
      regalos: [],
      usuario: new UsuarioEntity(),
    }

    const newCarrito: CarritoEntity = await service.create(carrito);
    expect(newCarrito).not.toBeNull();

    const storedCarrito: CarritoEntity = await repository.findOne({where: {id: newCarrito.id}})
    expect(storedCarrito).not.toBeNull();
    expect(storedCarrito.fechaCreacion).toEqual(newCarrito.fechaCreacion)
  });

  it('update should modify a carrito', async () => {
    const carrito: CarritoEntity = carritosList[0];
    carrito.fechaCreacion = faker.date.recent();

    const updatedCarrito: CarritoEntity = await service.update(carrito.id, carrito);
    expect(updatedCarrito).not.toBeNull();
  
    const storedCarrito: CarritoEntity = await repository.findOne({ where: { id: carrito.id } })
    expect(storedCarrito).not.toBeNull();
    expect(storedCarrito.fechaCreacion).toEqual(carrito.fechaCreacion)
  });
 
  it('update should throw an exception for an invalid carrito', async () => {
    let carrito: CarritoEntity = carritosList[0];
    carrito = {
      ...carrito, fechaCreacion: faker.date.recent(),
    }
    await expect(() => service.update("0", carrito)).rejects.toHaveProperty("message", "The carrito with the given id was not found")
  });

  it('delete should remove a carrito', async () => {
    const carrito: CarritoEntity = carritosList[0];
    await service.delete(carrito.id);
  
    const deletedCarrito: CarritoEntity = await repository.findOne({ where: { id: carrito.id } })
    expect(deletedCarrito).toBeNull();
  });

  it('delete should throw an exception for an invalid carrito', async () => {
    const carrito: CarritoEntity = carritosList[0];
    await service.delete(carrito.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The carrito with the given id was not found")
  });
 
});