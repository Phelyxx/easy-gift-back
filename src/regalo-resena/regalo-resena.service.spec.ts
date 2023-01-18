/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { RegaloEntity } from '../regalo/regalo.entity';
import { ResenaEntity } from '../resena/resena.entity';
import { Repository } from 'typeorm';
import { RegaloResenaService } from './regalo-resena.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RegaloResenaService', () => {
  let service: RegaloResenaService;
  let resenaRepository: Repository<ResenaEntity>;
  let regaloRepository: Repository<RegaloEntity>;
  let regalo: RegaloEntity;
  let resenaList : ResenaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegaloResenaService],
      imports: [...TypeOrmTestingConfig()],

    }).compile();

    service = module.get<RegaloResenaService>(RegaloResenaService);
    resenaRepository = module.get<Repository<ResenaEntity>>(getRepositoryToken(ResenaEntity));
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));
    await seedDataBase();


  });


  const seedDataBase = async () => {
    regaloRepository.clear();
    resenaRepository.clear();

    resenaList = []
    for(let i = 0; i < 5; i++){
      const resena: ResenaEntity = await resenaRepository.save({
        titulo: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
        calificacion: Number(faker.random.numeric())
      });

      resenaList.push(resena);
      
    }

    regalo = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
      resenas: resenaList
    })
  }


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  it('addResenaRegalo should add a resena to a usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    const newregalo = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    })

      const result: RegaloEntity = await service.addResenaRegalo(newregalo.id, newResena.id);

      expect(result.resenas.length).toBe(1);
      expect(result.resenas[0]).not.toBeNull();
      expect(result.resenas[0].calificacion).toBe(newResena.calificacion)
      expect(result.resenas[0].descripcion).toBe(newResena.descripcion)
      expect(result.resenas[0].fecha).toStrictEqual(newResena.fecha)
      expect(result.resenas[0].titulo).toBe(newResena.titulo)

  });

  it('addResenaRegalo should thrown exception for an invalid resena', async () => {
    const newregalo = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    })
    await expect(() => service.addResenaRegalo(newregalo.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found");
  });


  it('addResenaRegalo should throw an exception for an invalid regalo', async () => {
    const resena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(() => service.addResenaRegalo("0", resena.id)).rejects.toHaveProperty("message", "The regalo with the given id was not found");
  });

  it('findRegaloByUsuarioIdResenaId should return resena by regalo', async () => {
    const resena: ResenaEntity = resenaList[0];
    const storedResena: ResenaEntity = await service.findRegaloByRegaloIdResenaID(regalo.id, resena.id )
    expect(storedResena).not.toBeNull();
    expect(storedResena.titulo).toBe(resena.titulo);
    expect(storedResena.calificacion).toBe(resena.calificacion);
    expect(storedResena.descripcion).toBe(resena.descripcion);
    expect(storedResena.fecha).toStrictEqual(resena.fecha);
  });


  it('findRegaloByRegaloIdResenaID should throw an exception for an invalid resena', async () => {
    await expect(()=> service.findRegaloByRegaloIdResenaID(regalo.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });

  it('findRegaloByRegaloIdResenaID should throw an exception for an invalid usuario', async () => {
    const resena: ResenaEntity = resenaList[1]; 
    await expect(()=> service.findRegaloByRegaloIdResenaID("0", resena.id)).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  }); 
  it('findRegaloByRegaloIdResenaID should throw an exception for a resena not associated to the usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
        titulo: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
        calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.findRegaloByRegaloIdResenaID(regalo.id, newResena.id)).rejects.toHaveProperty("message", "The resena with the given id is not associated to the regalo"); 
  });

  it('findResenasByRegaloId should return resenas by regalo', async ()=>{
    const resena: ResenaEntity[] = await service.findResenasByRegaloId(regalo.id);
    expect(resena.length).toBe(5)
  });

  it('findResenasByRegaloId should throw an exception for an invalid regalo', async () => {
    await expect(()=> service.findResenasByRegaloId("0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('associateResenaRegalo should update resenas list for a regalo', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    const updatedRegalo: RegaloEntity = await service.associateResenaRegalo(regalo.id, [newResena]);
    expect(updatedRegalo.resenas.length).toBe(1);

    expect(updatedRegalo.resenas[0].titulo).toBe(newResena.titulo);
    expect(updatedRegalo.resenas[0].calificacion).toBe(newResena.calificacion);
    expect(updatedRegalo.resenas[0].descripcion).toBe(newResena.descripcion);
    expect(updatedRegalo.resenas[0].fecha).toStrictEqual(newResena.fecha);
  });

  it('associateResenaRegalo should throw an exception for an invalid regalo', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.associateResenaRegalo("0", [newResena])).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });


  it('associateResenaRegalo should throw an exception for an invalid resena', async () => {
    const newResena: ResenaEntity = resenaList[0];
    newResena.id = "0";

    await expect(()=> service.associateResenaRegalo(regalo.id, [newResena])).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });


  it('deleteResenaRegalo should remove an resena from a regalo', async () => {
    const resena: ResenaEntity = resenaList[0];
    
    await service.deleteResenaRegalo(regalo.id, resena.id);

    const storedRegalo: RegaloEntity = await regaloRepository.findOne({where: {id: regalo.id}, relations: ["resenas"]});
    const deleteResena: ResenaEntity = storedRegalo.resenas.find(a => a.id === resena.id);

    expect(deleteResena).toBeUndefined();

  });

  it('deleteResenaRegalo should thrown an exception for an invalid resenas', async () => {
    await expect(()=> service.deleteResenaRegalo(regalo.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });

  it('deleteResenaRegalo should thrown an exception for an invalid regalo', async () => {
    const resena: ResenaEntity = resenaList[0];
    await expect(()=> service.deleteResenaRegalo("0", resena.id)).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });


  it('deleteResenaRegalo should thrown an exception for an non asocciated resena', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.deleteResenaRegalo(regalo.id, newResena.id)).rejects.toHaveProperty("message", "The resena with the given id is not associated to the regalo"); 
  }); 
});
