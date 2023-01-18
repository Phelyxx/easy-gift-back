/* eslint-disable prettier/prettier */
/*archivo src/resena/resena.service.spec.ts*/
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResenaEntity } from './resena.entity';
import { ResenaService } from './resena.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { async } from 'rxjs';


describe('ResenaService', () => {
  let service: ResenaService;
  let repository: Repository<ResenaEntity>;
  let resenaList: ResenaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    repository = module.get<Repository<ResenaEntity>>(getRepositoryToken(ResenaEntity))
    await seedDataBase();
  });

  const seedDataBase = async () => {
    repository.clear();
    resenaList = [];
    for(let i = 0; i < 5; i++){
      const resena: ResenaEntity = await repository.save({
        titulo: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
        calificacion: Number(faker.random.numeric())
      });

      resenaList.push(resena);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined', async () => {
    const resenas: ResenaEntity[] = await service.findAll()
    expect(resenas).not.toBeNull();
    expect(resenas).toHaveLength(resenaList.length);
  });


  it('findOne should return a resena by id',async () => {
      const storedResena: ResenaEntity = resenaList[0];
      const resena: ResenaEntity = await service.findOne(storedResena.id);
      expect(resena).not.toBeNull();
      expect(resena.calificacion).toEqual(storedResena.calificacion);
      expect(resena.descripcion).toEqual(storedResena.descripcion);
      expect(resena.fecha).toEqual(storedResena.fecha);
      expect(resena.titulo).toEqual(storedResena.titulo);
    });

    it('findOne should throw an exception for an invalid resena', async () => {
      await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The resena with the given id was not found")
    });


    it('create should return a bew ewsena', async () => {
      const resena: ResenaEntity = {
        id: "",
        titulo: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
        calificacion: Number(faker.random.numeric()),
        usuario: null,
        regalo: null
      }

      const newResena: ResenaEntity = await service.create(resena);
      expect(newResena).not.toBeNull();

      const storedResena: ResenaEntity = await repository.findOne({where:{id: newResena.id}})
      expect(storedResena).not.toBeNull();
      expect(storedResena.calificacion).toEqual(newResena.calificacion)
      expect(storedResena.descripcion).toEqual(newResena.descripcion);
      expect(storedResena.fecha).toEqual(newResena.fecha);
      expect(storedResena.titulo).toEqual(newResena.titulo);
    });

    it('update should modify a museum', async () => {
      const resena: ResenaEntity = resenaList[0];
      resena.descripcion = "new descripcion";
      resena.titulo = "new Titulo";

      const updateResena: ResenaEntity  = await service.update(resena.id, resena);
      expect(updateResena).not.toBeNull();

      const storedResena: ResenaEntity = await repository.findOne({ where: {id: resena.id}});
      expect(storedResena).not.toBeNull();
      expect(storedResena.calificacion).toEqual(resena.calificacion);
      expect(storedResena.titulo).toEqual(resena.titulo);

    });


    it('update should throw an exception for an invalid resena', async () => {
      let resena: ResenaEntity = resenaList[0];
      resena = {
        ...resena, descripcion: "New descripcion", titulo : "New titulo"
      }
      await expect(() => service.update("0", resena)).rejects.toHaveProperty("message", "The resena with the given id was not found")
    });

    it('delete should remove a reseba', async () => {
      const resena: ResenaEntity = resenaList[0];
      await service.delete(resena.id);
    
      const deletedResena: ResenaEntity = await repository.findOne({ where: { id: resena.id } })
      expect(deletedResena).toBeNull();
    });

    it('delete should throw an exception for an invalid museum', async () => {
      const resena: ResenaEntity = resenaList[0];
      await service.delete(resena.id);
      await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The resena with the given id was not found")
    }); 



});

