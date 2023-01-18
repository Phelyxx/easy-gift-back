import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloCategoriaService } from './regalo-categoria.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

/**
 * Define los tipos de categoria posibles
 */
var tipoCategoria = ["moda", "joyeria", "deportes", "libros", "tecnologia", "juguetes"]

describe('RegaloCategoriaService', () => {
  let service: RegaloCategoriaService;
  let regaloRepository: Repository<RegaloEntity>;
  let categoriaRepository: Repository<CategoriaEntity>;
  let regalo: RegaloEntity;
  let categoriasList : CategoriaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RegaloCategoriaService],
    }).compile();

    service = module.get<RegaloCategoriaService>(RegaloCategoriaService);
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));
    categoriaRepository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    categoriaRepository.clear();
    regaloRepository.clear();

    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: CategoriaEntity = await categoriaRepository.save({
          nombre: faker.helpers.arrayElement(tipoCategoria)
        })
        categoriasList.push(categoria);
    }

    regalo = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
      categorias: categoriasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCategoriaRegalo debe agregar una categoria a un regalo', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
    })

    const result: RegaloEntity = await service.addCategoriaRegalo(newRegalo.id, newCategoria.id);
    
    expect(result.categorias.length).toBe(1);
    expect(result.categorias[0]).not.toBeNull();
    expect(result.categorias[0].nombre).toBe(newCategoria.nombre)
  });

  it('addCategoriaRegalo debe arrojar una excepcion para una categoria invalida', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
    })

    await expect(() => service.addCategoriaRegalo(newRegalo.id, "0")).rejects.toHaveProperty("message", "La categoria con el ID dado no fue encontrada");
  });

  it('addCategoriaRegalo debe arrojar una excepcion para un regalo invalido', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    await expect(() => service.addCategoriaRegalo("0", newCategoria.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado");
  });

  it('findCategoriaByRegaloIdCategoriaId debe retornar una categoria para un regalo', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    const storedCategoria: CategoriaEntity = await service.findCategoriaByRegaloIdCategoriaId(regalo.id, categoria.id, )
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toBe(categoria.nombre);
  });

  it('findCategoriaByRegaloIdCategoriaId debe lanzar una excepcion para una categoria invalida', async () => {
    await expect(()=> service.findCategoriaByRegaloIdCategoriaId(regalo.id, "0")).rejects.toHaveProperty("message", "La categoria con el ID dado no fue encontrada"); 
  });

  it('findCategoriaByRegaloIdCategoriaId debe lanzar una excepcion para un regalo invalido', async () => {
    const categoria: CategoriaEntity = categoriasList[0]; 
    await expect(()=> service.findCategoriaByRegaloIdCategoriaId("0", categoria.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('findCategoriaByRegaloIdCategoriaId debe lanzar una excepcion para una categoria no asociada a un regalo', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    await expect(()=> service.findCategoriaByRegaloIdCategoriaId(regalo.id, newCategoria.id)).rejects.toHaveProperty("message", "La categoria con el ID dado no se encuentra asociada al regalo"); 
  });

  it('findCategoriasByRegaloId debe retornar las categorias de un regalo', async ()=>{
    const categorias: CategoriaEntity[] = await service.findCategoriasByRegaloId(regalo.id);
    expect(categorias.length).toBe(5)
  });

  it('findCategoriasByRegaloId debe lanzar una excepcion para un regalo invalido', async () => {
    await expect(()=> service.findCategoriasByRegaloId("0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('associateCategoriasRegalo debe actualizar la lista de categorias para un regalo', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    const updatedRegalo: RegaloEntity = await service.associateCategoriasRegalo(regalo.id, [newCategoria]);

    expect(updatedRegalo.categorias.length).toBe(1);
    expect(updatedRegalo.categorias[0].nombre).toBe(newCategoria.nombre);
  });

  it('associateCategoriasRegalo debe lanzar una excepcion para un regalo invalido', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    await expect(()=> service.associateCategoriasRegalo("0", [newCategoria])).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('associateCategoriasRegalo debe lanzar una excepcion para una categoria invalida', async () => {
    const newCategoria: CategoriaEntity = categoriasList[0];
    newCategoria.id = "0";

    await expect(()=> service.associateCategoriasRegalo(regalo.id, [newCategoria])).rejects.toHaveProperty("message", "La categoria con el ID dado no fue encontrada"); 
  });

  it('deleteCategoriaRegalo debe eliminar la categoria de un regalo', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    
    await service.deleteCategoriaRegalo(regalo.id, categoria.id);

    const storedRegalo: RegaloEntity = await regaloRepository.findOne({where: {id: regalo.id}, relations: ["categorias"]});
    const deletedCategoria: CategoriaEntity = storedRegalo.categorias.find(a => a.id === categoria.id);

    expect(deletedCategoria).toBeUndefined();

  });

  it('deleteCategoriaToRegalo debe lanzar una excepcion para una categoria invalida', async () => {
    await expect(()=> service.deleteCategoriaRegalo(regalo.id, "0")).rejects.toHaveProperty("message", "La categoria con el ID dado no fue encontrada"); 
  });

  it('deleteCategoriaToRegalo should thrown an exception for an invalid regalo', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await expect(()=> service.deleteCategoriaRegalo("0", categoria.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('deleteCategoriaToRegalo debe lanzar una excepcion para una categoria no asociada a un regalo', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria)
    });

    await expect(()=> service.deleteCategoriaRegalo(regalo.id, newCategoria.id)).rejects.toHaveProperty("message", "La categoria con el ID dado no se encuentra asociada al regalo"); 
  }); 
});
