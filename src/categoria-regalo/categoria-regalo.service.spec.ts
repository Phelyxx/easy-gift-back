import { Test, TestingModule } from '@nestjs/testing';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoriaRegaloService } from './categoria-regalo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

const nombres = ["Moda", "Joyeria", "Deportes", "Libros", "Tecnologia", "Juguetes"];

describe('CategoriaRegaloService', () => {
  let service: CategoriaRegaloService;
  let categoriaRepository: Repository<CategoriaEntity>;
  let regaloRepository: Repository<RegaloEntity>;
  let categoria: CategoriaEntity;
  let regalosList : RegaloEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaRegaloService],
    }).compile();

    service = module.get<CategoriaRegaloService>(CategoriaRegaloService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    regaloRepository.clear();
    categoriaRepository.clear();

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

    categoria = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(nombres),
      regalos: regalosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRegaloCategoria should add an regalo to a categoria', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(nombres), 
    })

    const result: CategoriaEntity = await service.addRegaloCategoria(newCategoria.id, newRegalo.id);
    
    expect(result.regalos.length).toBe(1);
    expect(result.regalos[0]).not.toBeNull();
    expect(result.regalos[0].nombre).toBe(newRegalo.nombre);
    expect(result.regalos[0].descripcion).toBe(newRegalo.descripcion);
    expect(result.regalos[0].imagen).toBe(newRegalo.imagen);
    expect(result.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio);
    expect(result.regalos[0].genero).toBe(newRegalo.genero);
    expect(result.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio);
  });

  it('addRegaloCategoria should thrown exception for an invalid regalo', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(nombres), 
    })

    await expect(() => service.addRegaloCategoria(newCategoria.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found");
  });

  it('addRegaloCategoria should throw an exception for an invalid categoria', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(() => service.addRegaloCategoria("0", newRegalo.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found");
  });

  it('findRegaloByCategoriaIdRegaloId should return regalo by categoria', async () => {
    const regalo: RegaloEntity = regalosList[0];
    const storedRegalo: RegaloEntity = await service.findRegaloByCategoriaIdRegaloId(categoria.id, regalo.id, )
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toBe(regalo.nombre);
    expect(storedRegalo.descripcion).toBe(regalo.descripcion);
    expect(storedRegalo.imagen).toBe(regalo.imagen);
    expect(storedRegalo.precioPromedio).toBe(regalo.precioPromedio);
    expect(storedRegalo.genero).toBe(regalo.genero);
    expect(storedRegalo.calificacionPromedio).toBe(regalo.calificacionPromedio);
  });

  it('findRegaloByCategoriaIdRegaloId should throw an exception for an invalid regalo', async () => {
    await expect(()=> service.findRegaloByCategoriaIdRegaloId(categoria.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('findRegaloByCategoriaIdRegaloId should throw an exception for an invalid categoria', async () => {
    const regalo: RegaloEntity = regalosList[0]; 
    await expect(()=> service.findRegaloByCategoriaIdRegaloId("0", regalo.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('findRegaloByCategoriaIdRegaloId should throw an exception for an regalo not associated to the categoria', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.findRegaloByCategoriaIdRegaloId(categoria.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the categoria"); 
  });

  it('findRegalosByCategoriaId should return regalos by categoria', async ()=>{
    const regalos: RegaloEntity[] = await service.findRegalosByCategoriaId(categoria.id);
    expect(regalos.length).toBe(5)
  });

  it('findRegalosByCategoriaId should throw an exception for an invalid categoria', async () => {
    await expect(()=> service.findRegalosByCategoriaId("0")).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('associateRegalosCategoria should update regalos list for a categoria', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const updatedCategoria: CategoriaEntity = await service.associateRegalosCategoria(categoria.id, [newRegalo]);
    expect(updatedCategoria.regalos.length).toBe(1);

    expect(updatedCategoria.regalos[0].nombre).toBe(newRegalo.nombre);
    expect(updatedCategoria.regalos[0].descripcion).toBe(newRegalo.descripcion);
    expect(updatedCategoria.regalos[0].imagen).toBe(newRegalo.imagen);
    expect(updatedCategoria.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio);
    expect(updatedCategoria.regalos[0].genero).toBe(newRegalo.genero);
    expect(updatedCategoria.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio);
  });

  it('associateRegalosCategoria should throw an exception for an invalid categoria', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.associateRegalosCategoria("0", [newRegalo])).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('associateRegalosCategoria should throw an exception for an invalid regalo', async () => {
    const newRegalo: RegaloEntity = regalosList[0];
    newRegalo.id = "0";

    await expect(()=> service.associateRegalosCategoria(categoria.id, [newRegalo])).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToCategoria should remove an regalo from a categoria', async () => {
    const regalo: RegaloEntity = regalosList[0];
    
    await service.deleteRegaloCategoria(categoria.id, regalo.id);

    const storedCategoria: CategoriaEntity = await categoriaRepository.findOne({where: {id: categoria.id}, relations: ["regalos"]});
    const deletedRegalo: RegaloEntity = storedCategoria.regalos.find(a => a.id === regalo.id);

    expect(deletedRegalo).toBeUndefined();

  });

  it('deleteRegaloToCategoria should thrown an exception for an invalid regalo', async () => {
    await expect(()=> service.deleteRegaloCategoria(categoria.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToCategoria should thrown an exception for an invalid categoria', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await expect(()=> service.deleteRegaloCategoria("0", regalo.id)).rejects.toHaveProperty("message", "The categoria with the given id was not found"); 
  });

  it('deleteRegaloToCategoria should thrown an exception for an non asocciated regalo', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.deleteRegaloCategoria(categoria.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the categoria"); 
  }); 

});