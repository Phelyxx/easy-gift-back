import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { RegaloEntity } from './regalo.entity';
import { RegaloService } from './regalo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { CarritoEntity } from '../carrito/carrito.entity';

describe('RegaloService', () => {
  let service: RegaloService;
  let repository: Repository<RegaloEntity>;
  let regalosList: RegaloEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RegaloService],
    }).compile();

    service = module.get<RegaloService>(RegaloService);
    repository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    regalosList = [];
    for(let i = 0; i < 5; i++){
        const regalo: RegaloEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
        precioPromedio: parseFloat(faker.commerce.price()),
        genero: faker.name.sex(),
        calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
        cantidad: faker.datatype.number({ min: 0, max: 100 }),
      })
      regalosList.push(regalo);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /**
   * Spec para probar el metodo findAll
   */
  it('findAll debe retornar todos los regalos', async () => {
    const regalos: RegaloEntity[] = await service.findAll();
    expect(regalos).not.toBeNull();
    expect(regalos).toHaveLength(regalosList.length);
  });

  /**
   * Spec para probar el metodo findOne
   */
   it('findOne debe retornar un regalo por id', async () => {
    const storedRegalo: RegaloEntity = regalosList[0];
    const regalo: RegaloEntity = await service.findOne(storedRegalo.id);
    expect(regalo).not.toBeNull();
    expect(regalo.nombre).toEqual(storedRegalo.nombre)
    expect(regalo.descripcion).toEqual(storedRegalo.descripcion)
    expect(regalo.imagen).toEqual(regalo.imagen)
    expect(regalo.precioPromedio).toEqual(regalo.precioPromedio)
    expect(regalo.genero).toEqual(regalo.genero)
    expect(regalo.calificacionPromedio).toEqual(regalo.calificacionPromedio)
    expect(regalo.cantidad).toEqual(regalo.cantidad)
  });

  /**
   * Prueba (que debe fallar) para el metodo de findOne: intentando encontrar un regalo que no existe
   */
   it('findOne debe retornar un regalo por id', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado")
  });


  /**
   * Prueba del metodo create
   */
  it('create debe retornar un nuevo regalo', async () => {
    const regalo: RegaloEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
      cantidad: faker.datatype.number({ min: 0, max: 100 }),
      wishlist: new WishlistEntity,
      carrito: new CarritoEntity,
      tiendas: [],
      categorias: [],
      resenas: []
    }
    // Se crea un regalo y se espera que no sea nulo
    const newRegalo: RegaloEntity = await service.create(regalo);
    expect(newRegalo).not.toBeNull();
 
    // Busco el regalo recien creado y verifico que sea el mismo
    const storedRegalo: RegaloEntity = await repository.findOne({where: {id: newRegalo.id}})
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toEqual(storedRegalo.nombre)
    expect(storedRegalo.descripcion).toEqual(storedRegalo.descripcion)
    expect(storedRegalo.imagen).toEqual(regalo.imagen)
    expect(storedRegalo.precioPromedio).toEqual(regalo.precioPromedio)
    expect(storedRegalo.genero).toEqual(regalo.genero)
    expect(storedRegalo.calificacionPromedio).toEqual(regalo.calificacionPromedio)
    expect(storedRegalo.cantidad).toEqual(regalo.cantidad)
  });

  /**
   * Prueba del metodo update
   */
  it('update debe modificar un regalo', async () => {
    const regalo: RegaloEntity = regalosList[0];
    regalo.nombre = "Nuevo nombre";
    regalo.descripcion = "Nueva descripcion";
     const updatedRegalo: RegaloEntity = await service.update(regalo.id, regalo);
    expect(updatedRegalo).not.toBeNull();
     const storedRegalo: RegaloEntity = await repository.findOne({ where: { id: regalo.id } })
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toEqual(regalo.nombre)
    expect(storedRegalo.descripcion).toEqual(regalo.descripcion)
  });

  /**
   * Prueba (que debe fallar) para el metodo update: intentando actualizar un regalo que no existe
   */
   it('update debe lanzar una excepcion para un regalo invalido', async () => {
    let regalo: RegaloEntity = regalosList[0];
    regalo = {
      ...regalo, nombre: "Nuevo nombre", descripcion: "Nueva direccion"
    }
    await expect(() => service.update("0", regalo)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado")
  });

  /**
   * Prueba del metodo delete
   */
   it('delete debe remover un regalo', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await service.delete(regalo.id);
     const deletedRegalo: RegaloEntity = await repository.findOne({ where: { id: regalo.id } })
    expect(deletedRegalo).toBeNull();
  });

  /**
   * Prueba (que debe fallar) del metodo delete: intentando eliminar un regalo que no existe
   */
  it('delete debe lanzar una excepcion para un regalo invalido', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await service.delete(regalo.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado")
  });
  
});
