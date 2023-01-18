import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CategoriaEntity } from './categoria.entity';
import { CategoriaService } from './categoria.service';

import { faker } from '@faker-js/faker';

const nombres = ["Moda", "Joyeria", "Deportes", "Libros", "Tecnologia", "Juguetes"];

describe('CategoriaService', () => {
  let service: CategoriaService;
  let repository: Repository<CategoriaEntity>;
  let categoriasList: CategoriaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaService],
    }).compile();

    service = module.get<CategoriaService>(CategoriaService);
    repository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    categoriasList = [];
    for(let i = 0; i < 5; i++){
        const categoria: CategoriaEntity = await repository.save({
        nombre: faker.helpers.arrayElement(nombres),
      })
        categoriasList.push(categoria);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all categorias', async () => {
    const categorias: CategoriaEntity[] = await service.findAll();
    expect(categorias).not.toBeNull();
    expect(categorias).toHaveLength(categoriasList.length);
  });

  it('findOne should return a categoria by id', async () => {
    const storedCategoria: CategoriaEntity = categoriasList[0];
    const categoria: CategoriaEntity = await service.findOne(storedCategoria.id);
    expect(categoria).not.toBeNull();
    expect(categoria.nombre).toEqual(storedCategoria.nombre)
  });

  it('findOne should throw an exception for an invalid categoria', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The categoria with the given id was not found")
  });

  it('create should return a new categoria', async () => {
    const categoria: CategoriaEntity = {
      id: "",
      nombre: faker.helpers.arrayElement(nombres), 
      regalos: [],
      usuarios: []
    }

    const newCategoria: CategoriaEntity = await service.create(categoria);
    expect(newCategoria).not.toBeNull();

    const storedCategoria: CategoriaEntity = await repository.findOne({where: {id: newCategoria.id}})
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(newCategoria.nombre)
  });

  it('create should return an exception for an unvalid categoria name', async () => {
    const categoria: CategoriaEntity = {
      id: "",
      nombre: "NA", 
      regalos: [],
      usuarios: []
    }
    await expect(() => service.create(categoria)).rejects.toHaveProperty("message", "The nombre is not valid")

  });

  it('update should modify a categoria', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    categoria.nombre = faker.helpers.arrayElement(nombres);
  
    const updatedCategoria: CategoriaEntity = await service.update(categoria.id, categoria);
    expect(updatedCategoria).not.toBeNull();
  
    const storedCategoria: CategoriaEntity = await repository.findOne({ where: { id: categoria.id } })
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toEqual(categoria.nombre)
  });

  it('update should return an exception for an unvalid categoria name', async () => {
    let categoria: CategoriaEntity = categoriasList[0];
    categoria = {
      ...categoria, nombre: "NA"
    }
    await expect(() => service.update(categoria.id, categoria)).rejects.toHaveProperty("message", "The nombre is not valid")

  });
 
  it('update should throw an exception for an invalid categoria', async () => {
    let categoria: CategoriaEntity = categoriasList[0];
    categoria = {
      ...categoria, nombre: faker.helpers.arrayElement(nombres),
    }
    await expect(() => service.update("0", categoria)).rejects.toHaveProperty("message", "The categoria with the given id was not found")
  });

  it('delete should remove a categoria', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.id);
  
    const deletedCategoria: CategoriaEntity = await repository.findOne({ where: { id: categoria.id } })
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid categoria', async () => {
    const categoria: CategoriaEntity = categoriasList[0];
    await service.delete(categoria.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The categoria with the given id was not found")
  });
 
});