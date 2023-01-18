import { Test, TestingModule } from '@nestjs/testing';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Repository } from 'typeorm';
import { CarritoEntity } from '../carrito/carrito.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CarritoRegaloService } from './carrito-regalo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CarritoRegaloService', () => {
  let service: CarritoRegaloService;
  let carritoRepository: Repository<CarritoEntity>;
  let regaloRepository: Repository<RegaloEntity>;
  let carrito: CarritoEntity;
  let regalosList : RegaloEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CarritoRegaloService],
    }).compile();

    service = module.get<CarritoRegaloService>(CarritoRegaloService);
    carritoRepository = module.get<Repository<CarritoEntity>>(getRepositoryToken(CarritoEntity));
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    regaloRepository.clear();
    carritoRepository.clear();

    regalosList = [];
    for(let i = 0; i < 5; i++){
        const regalo: RegaloEntity = await regaloRepository.save({
          nombre: faker.company.name(),
          descripcion: faker.lorem.sentence(),
          imagen: faker.image.imageUrl(),
          precioPromedio: parseFloat(faker.commerce.price()),
          genero: faker.name.sex(),
          calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
        })
        regalosList.push(regalo);
    }

    carrito = await carritoRepository.save({
      fechaCreacion: faker.date.recent(),
      regalos: regalosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRegaloCarrito should add an regalo to a carrito', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const newCarrito: CarritoEntity = await carritoRepository.save({
      fechaCreacion: faker.date.recent(),
    })

    const result: CarritoEntity = await service.addRegaloCarrito(newCarrito.id, newRegalo.id);
    
    expect(result.regalos.length).toBe(1);
    expect(result.regalos[0]).not.toBeNull();
    expect(result.regalos[0].nombre).toBe(newRegalo.nombre);
    expect(result.regalos[0].descripcion).toBe(newRegalo.descripcion);
    expect(result.regalos[0].imagen).toBe(newRegalo.imagen);
    expect(result.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio);
    expect(result.regalos[0].genero).toBe(newRegalo.genero);
    expect(result.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio);
  });

  it('addRegaloCarrito should thrown exception for an invalid regalo', async () => {
    const newCarrito: CarritoEntity = await carritoRepository.save({
      fechaCreacion: faker.date.recent(),
    })

    await expect(() => service.addRegaloCarrito(newCarrito.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found");
  });

  it('addRegaloCarrito should throw an exception for an invalid carrito', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(() => service.addRegaloCarrito("0", newRegalo.id)).rejects.toHaveProperty("message", "The carrito with the given id was not found");
  });

  it('findRegaloByCarritoIdRegaloId should return regalo by carrito', async () => {
    const regalo: RegaloEntity = regalosList[0];
    const storedRegalo: RegaloEntity = await service.findRegaloByCarritoIdRegaloId(carrito.id, regalo.id, )
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toBe(regalo.nombre);
    expect(storedRegalo.descripcion).toBe(regalo.descripcion);
    expect(storedRegalo.imagen).toBe(regalo.imagen);
    expect(storedRegalo.precioPromedio).toBe(regalo.precioPromedio);
    expect(storedRegalo.genero).toBe(regalo.genero);
    expect(storedRegalo.calificacionPromedio).toBe(regalo.calificacionPromedio);
  });

  it('findRegaloByCarritoIdRegaloId should throw an exception for an invalid regalo', async () => {
    await expect(()=> service.findRegaloByCarritoIdRegaloId(carrito.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('findRegaloByCarritoIdRegaloId should throw an exception for an invalid carrito', async () => {
    const regalo: RegaloEntity = regalosList[0]; 
    await expect(()=> service.findRegaloByCarritoIdRegaloId("0", regalo.id)).rejects.toHaveProperty("message", "The carrito with the given id was not found"); 
  });

  it('findRegaloByCarritoIdRegaloId should throw an exception for an regalo not associated to the carrito', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.findRegaloByCarritoIdRegaloId(carrito.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the carrito"); 
  });

  it('findRegalosByCarritoId should return regalos by carrito', async ()=>{
    const regalos: RegaloEntity[] = await service.findRegalosByCarritoId(carrito.id);
    expect(regalos.length).toBe(5)
  });

  it('findRegalosByCarritoId should throw an exception for an invalid carrito', async () => {
    await expect(()=> service.findRegalosByCarritoId("0")).rejects.toHaveProperty("message", "The carrito with the given id was not found"); 
  });

  it('associateRegalosCarrito should update regalos list for a carrito', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const updatedCarrito: CarritoEntity = await service.associateRegalosCarrito(carrito.id, [newRegalo]);
    expect(updatedCarrito.regalos.length).toBe(1);

    expect(updatedCarrito.regalos[0].nombre).toBe(newRegalo.nombre);
    expect(updatedCarrito.regalos[0].descripcion).toBe(newRegalo.descripcion);
    expect(updatedCarrito.regalos[0].imagen).toBe(newRegalo.imagen);
    expect(updatedCarrito.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio);
    expect(updatedCarrito.regalos[0].genero).toBe(newRegalo.genero);
    expect(updatedCarrito.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio);
  });

  it('associateRegalosCarrito should throw an exception for an invalid carrito', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.associateRegalosCarrito("0", [newRegalo])).rejects.toHaveProperty("message", "The carrito with the given id was not found"); 
  });

  it('associateRegalosCarrito should throw an exception for an invalid regalo', async () => {
    const newRegalo: RegaloEntity = regalosList[0];
    newRegalo.id = "0";

    await expect(()=> service.associateRegalosCarrito(carrito.id, [newRegalo])).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToCarrito should remove an regalo from a carrito', async () => {
    const regalo: RegaloEntity = regalosList[0];
    
    await service.deleteRegaloCarrito(carrito.id, regalo.id);

    const storedCarrito: CarritoEntity = await carritoRepository.findOne({where: {id: carrito.id}, relations: ["regalos"]});
    const deletedRegalo: RegaloEntity = storedCarrito.regalos.find(a => a.id === regalo.id);

    expect(deletedRegalo).toBeUndefined();

  });

  it('deleteRegaloToCarrito should thrown an exception for an invalid regalo', async () => {
    await expect(()=> service.deleteRegaloCarrito(carrito.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToCarrito should thrown an exception for an invalid carrito', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await expect(()=> service.deleteRegaloCarrito("0", regalo.id)).rejects.toHaveProperty("message", "The carrito with the given id was not found"); 
  });

  it('deleteRegaloToCarrito should thrown an exception for an non asocciated regalo', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.deleteRegaloCarrito(carrito.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the carrito"); 
  }); 

});