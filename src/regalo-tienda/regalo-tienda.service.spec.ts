import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from '../tienda/tienda.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloTiendaService } from './regalo-tienda.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RegaloTiendaService', () => {
  let service: RegaloTiendaService;
  let regaloRepository: Repository<RegaloEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let regalo: RegaloEntity;
  let tiendasList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RegaloTiendaService],
    }).compile();

    service = module.get<RegaloTiendaService>(RegaloTiendaService);
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    regaloRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          nombre: faker.company.name(),
          imagen: faker.image.imageUrl(),
          descripcion: faker.lorem.sentence(),
          paginaWeb: faker.internet.url(),
          telefono: parseInt(faker.random.numeric(10))
        })
        tiendasList.push(tienda);
    }

    regalo = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 }),
      tiendas: tiendasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTiendaRegalo debe agregar una tienda a un regalo', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });

    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    })

    const result: RegaloEntity = await service.addTiendaRegalo(newRegalo.id, newTienda.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre)
    expect(result.tiendas[0].imagen).toBe(newTienda.imagen)
    expect(result.tiendas[0].descripcion).toBe(newTienda.descripcion)
    expect(result.tiendas[0].paginaWeb).toBe(newTienda.paginaWeb)
    expect(result.tiendas[0].telefono).toBe(newTienda.telefono)
  });

  it('addTiendaRegalo debe lanzar una excepcion para una tienda invalida', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    })

    await expect(() => service.addTiendaRegalo(newRegalo.id, "0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada");
  });

  it('addTiendaRegalo debe lanzar una excepcion para un regalo invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });

    await expect(() => service.addTiendaRegalo("0", newTienda.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado");
  });

  it('findTiendaByRegaloIdTiendaId debe retornar una tienda para un regalo', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity = await service.findTiendaByRegaloIdTiendaId(regalo.id, tienda.id, )
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.imagen).toBe(tienda.imagen);
    expect(storedTienda.descripcion).toBe(tienda.descripcion);
    expect(storedTienda.paginaWeb).toBe(tienda.paginaWeb);
    expect(storedTienda.telefono).toBe(tienda.telefono);
  });

  it('findTiendaByRegaloIdTiendaId debe lanzar una excepcion para una tienda invalida', async () => {
    await expect(()=> service.findTiendaByRegaloIdTiendaId(regalo.id, "0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada"); 
  });

  it('findTiendaByRegaloIdTiendaId debe lanzar una excepcion para un regalo invalido', async () => {
    const tienda: TiendaEntity = tiendasList[0]; 
    await expect(()=> service.findTiendaByRegaloIdTiendaId("0", tienda.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('findTiendaByRegaloIdTiendaId debe lanzar una excepcion para una tienda no asociada a un regalo', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });

    await expect(()=> service.findTiendaByRegaloIdTiendaId(regalo.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda con el ID dado no se encuentra asociada al regalo"); 
  });

  it('findTiendasByRegaloId debe retornar las tiendas de un regalo', async ()=>{
    const tiendas: TiendaEntity[] = await service.findTiendasByRegaloId(regalo.id);
    expect(tiendas.length).toBe(5)
  });

  it('findTiendasByRegaloId debe lanzar una excepcion para un regalo invalido', async () => {
    await expect(()=> service.findTiendasByRegaloId("0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('associateTiendasRegalo should update tiendas list for a regalo', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });

    const updatedRegalo: RegaloEntity = await service.associateTiendasRegalo(regalo.id, [newTienda]);
    expect(updatedRegalo.tiendas.length).toBe(1);

    expect(updatedRegalo.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedRegalo.tiendas[0].imagen).toBe(newTienda.imagen);
    expect(updatedRegalo.tiendas[0].descripcion).toBe(newTienda.descripcion);
    expect(updatedRegalo.tiendas[0].paginaWeb).toBe(newTienda.paginaWeb);
    expect(updatedRegalo.tiendas[0].telefono).toBe(newTienda.telefono);
  });

  it('associateTiendasRegalo debe lanzar una excepcion para un regalo invalido', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });

    await expect(()=> service.associateTiendasRegalo("0", [newTienda])).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('associateTiendasRegalo debe lanzar una excepcion para una tienda invalida', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(()=> service.associateTiendasRegalo(regalo.id, [newTienda])).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada"); 
  });

  it('deleteTiendaToRegalo debe eliminar la tienda de un regalo', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    
    await service.deleteTiendaRegalo(regalo.id, tienda.id);

    const storedRegalo: RegaloEntity = await regaloRepository.findOne({where: {id: regalo.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedRegalo.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();

  });

  it('deleteTiendaToRegalo debe lanzar una excepcion para una tienda invalida', async () => {
    await expect(()=> service.deleteTiendaRegalo(regalo.id, "0")).rejects.toHaveProperty("message", "La tienda con el ID dado no fue encontrada"); 
  });

  it('deleteTiendaToRegalo debe lanzar una excepcion para un regalo invalido', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(()=> service.deleteTiendaRegalo("0", tienda.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('deleteTiendaToRegalo debe lanzar una excepcion para una tienda no asociada a un regalo', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10))
    });
    await expect(()=> service.deleteTiendaRegalo(regalo.id, newTienda.id)).rejects.toHaveProperty("message", "La tienda con el ID dado no se encuentra asociada al regalo"); 
  }); 

});
