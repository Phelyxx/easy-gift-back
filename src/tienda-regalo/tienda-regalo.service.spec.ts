import { Test, TestingModule } from '@nestjs/testing';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaRegaloService } from './tienda-regalo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaRegaloService', () => {
  let service: TiendaRegaloService;
  let tiendaRepository: Repository<TiendaEntity>;
  let regaloRepository: Repository<RegaloEntity>;
  let tienda: TiendaEntity;
  let regalosList : RegaloEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaRegaloService],
    }).compile();

    service = module.get<TiendaRegaloService>(TiendaRegaloService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    regaloRepository.clear();
    tiendaRepository.clear();

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

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
      regalos: regalosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRegaloTienda should add an regalo to a tienda', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl(),
        precioPromedio: parseFloat(faker.commerce.price()),
        genero: faker.name.sex(),
        calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
    })

    const result: TiendaEntity = await service.addRegaloTienda(newTienda.id, newRegalo.id);
    
    expect(result.regalos.length).toBe(1);
    expect(result.regalos[0]).not.toBeNull();
    expect(result.regalos[0].nombre).toBe(newRegalo.nombre)
    expect(result.regalos[0].descripcion).toBe(newRegalo.descripcion)
    expect(result.regalos[0].imagen).toBe(newRegalo.imagen)
    expect(result.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio)
    expect(result.regalos[0].genero).toBe(newRegalo.genero)
    expect(result.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio)
  });

  it('addRegaloTienda should thrown exception for an invalid regalo', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
    })

    await expect(() => service.addRegaloTienda(newTienda.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found");
  });

  it('addRegaloTienda should throw an exception for an invalid tienda', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
  });

    await expect(() => service.addRegaloTienda("0", newRegalo.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('findRegaloByTiendaIdRegaloId should return regalo by tienda', async () => {
    const regalo: RegaloEntity = regalosList[0];
    const storedRegalo: RegaloEntity = await service.findRegaloByTiendaIdRegaloId(tienda.id, regalo.id, )
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toBe(regalo.nombre)
    expect(storedRegalo.descripcion).toBe(regalo.descripcion)
    expect(storedRegalo.imagen).toBe(regalo.imagen)
    expect(storedRegalo.precioPromedio).toBe(regalo.precioPromedio)
    expect(storedRegalo.genero).toBe(regalo.genero)
    expect(storedRegalo.calificacionPromedio).toBe(regalo.calificacionPromedio)

  });

  it('findRegaloByTiendaIdRegaloId should throw an exception for an invalid regalo', async () => {
    await expect(()=> service.findRegaloByTiendaIdRegaloId(tienda.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('findRegaloByTiendaIdRegaloId should throw an exception for an invalid tienda', async () => {
    const regalo: RegaloEntity = regalosList[0]; 
    await expect(()=> service.findRegaloByTiendaIdRegaloId("0", regalo.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findRegaloByTiendaIdRegaloId should throw an exception for an regalo not associated to the tienda', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
  });

    await expect(()=> service.findRegaloByTiendaIdRegaloId(tienda.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the tienda"); 
  });

  it('findRegalosByTiendaId should return regalos by tienda', async ()=>{
    const regalos: RegaloEntity[] = await service.findRegalosByTiendaId(tienda.id);
    expect(regalos.length).toBe(5)
  });

  it('findRegalosByTiendaId should throw an exception for an invalid tienda', async () => {
    await expect(()=> service.findRegalosByTiendaId("0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('associateRegalosTienda should update regalos list for a tienda', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
  });

    const updatedTienda: TiendaEntity = await service.associateRegalosTienda(tienda.id, [newRegalo]);
    
    expect(updatedTienda.regalos.length).toBe(1);
    expect(updatedTienda.regalos[0]).not.toBeNull();
    expect(updatedTienda.regalos[0].nombre).toBe(newRegalo.nombre)
    expect(updatedTienda.regalos[0].descripcion).toBe(newRegalo.descripcion)
    expect(updatedTienda.regalos[0].imagen).toBe(newRegalo.imagen)
    expect(updatedTienda.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio)
    expect(updatedTienda.regalos[0].genero).toBe(newRegalo.genero)
    expect(updatedTienda.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio)

  });

  it('associateRegalosTienda should throw an exception for an invalid tienda', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
  });

    await expect(()=> service.associateRegalosTienda("0", [newRegalo])).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('associateRegalosTienda should throw an exception for an invalid regalo', async () => {
    const newRegalo: RegaloEntity = regalosList[0];
    newRegalo.id = "0";

    await expect(()=> service.associateRegalosTienda(tienda.id, [newRegalo])).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToTienda should remove an regalo from a tienda', async () => {
    const regalo: RegaloEntity = regalosList[0];
    
    await service.deleteRegaloTienda(tienda.id, regalo.id);

    const storedTienda: TiendaEntity = await tiendaRepository.findOne({where: {id: tienda.id}, relations: ["regalos"]});
    const deletedRegalo: RegaloEntity = storedTienda.regalos.find(a => a.id === regalo.id);

    expect(deletedRegalo).toBeUndefined();

  });

  it('deleteRegaloToTienda should thrown an exception for an invalid regalo', async () => {
    await expect(()=> service.deleteRegaloTienda(tienda.id, "0")).rejects.toHaveProperty("message", "The regalo with the given id was not found"); 
  });

  it('deleteRegaloToTienda should thrown an exception for an invalid tienda', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await expect(()=> service.deleteRegaloTienda("0", regalo.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteRegaloToTienda should thrown an exception for an non asocciated regalo', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
  });

    await expect(()=> service.deleteRegaloTienda(tienda.id, newRegalo.id)).rejects.toHaveProperty("message", "The regalo with the given id is not associated to the tienda"); 
  }); 

});