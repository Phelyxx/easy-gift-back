import { Test, TestingModule } from '@nestjs/testing';
import { RegaloEntity } from '../regalo/regalo.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { Repository } from 'typeorm';
import { WishlistRegaloService } from './wishlist-regalo.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('WishlistRegaloService', () => {
  let service: WishlistRegaloService;
  let wishlistRepository: Repository<WishlistEntity>;
  let regaloRepository: Repository<RegaloEntity>;
  let wishlist: WishlistEntity;
  let regalosList : RegaloEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [WishlistRegaloService],
    }).compile();

    service = module.get<WishlistRegaloService>(WishlistRegaloService);
    wishlistRepository = module.get<Repository<WishlistEntity>>(getRepositoryToken(WishlistEntity));
    regaloRepository = module.get<Repository<RegaloEntity>>(getRepositoryToken(RegaloEntity));

    await seedDatabase();
  });

  /**
   * Crea una base de datos semilla para los metodos
   */
  const seedDatabase = async () => {
    regaloRepository.clear();
    wishlistRepository.clear();

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

    wishlist = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      regalos: regalosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRegaloWishlist debe agregar un regalo a la wishlist', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: "Nuevo regalo",
      descripcion: "Este es el nuevo regalo",
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const newWishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()
    })

    const result: WishlistEntity = await service.addRegaloWishlist(newWishlist.id, newRegalo.id);
    
    expect(result.regalos.length).toBe(1);
    expect(result.regalos[0]).not.toBeNull();
    expect(result.regalos[0].nombre).toBe(newRegalo.nombre)
    expect(result.regalos[0].descripcion).toBe(newRegalo.descripcion)
    expect(result.regalos[0].imagen).toBe(newRegalo.imagen)
    expect(result.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio)
    expect(result.regalos[0].genero).toBe(newRegalo.genero)
    expect(result.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio)
  });

  it('addRegaloWishlist debe lanzar una excepcion para un regalo invalido', async () => {
    const newWishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()
    })

    await expect(() => service.addRegaloWishlist(newWishlist.id, "0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado");
  });

  it('addRegaloWishlist debe lanzar una excepcion para una wishlist invalida', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(() => service.addRegaloWishlist("0", newRegalo.id)).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada");
  });

  it('findRegaloByWishlistIdRegaloId debe retornar un regalo por wishlist', async () => {
    const regalo: RegaloEntity = regalosList[0];
    const storedRegalo: RegaloEntity = await service.findRegaloByWishlistIdRegaloId(wishlist.id, regalo.id, )
    expect(storedRegalo).not.toBeNull();
    expect(storedRegalo.nombre).toBe(regalo.nombre)
    expect(storedRegalo.descripcion).toBe(regalo.descripcion)
    expect(storedRegalo.imagen).toBe(regalo.imagen)
    expect(storedRegalo.precioPromedio).toBe(regalo.precioPromedio)
    expect(storedRegalo.genero).toBe(regalo.genero)
    expect(storedRegalo.calificacionPromedio).toBe(regalo.calificacionPromedio)
  });

  it('findRegaloByWishlistIdRegaloId debe lanzar una excepcion para un regalo invalido', async () => {
    await expect(()=> service.findRegaloByWishlistIdRegaloId(wishlist.id, "0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('findRegaloByWishlistIdRegaloId debe lanzar una excepcion para una wishlist invalida', async () => {
    const regalo: RegaloEntity = regalosList[0]; 
    await expect(()=> service.findRegaloByWishlistIdRegaloId("0", regalo.id)).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada"); 
  });

  it('findRegaloByWishlistIdRegaloId debe lanzar una excepcion para un regalo no asociado con la wishlist', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.findRegaloByWishlistIdRegaloId(wishlist.id, newRegalo.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no se encuentra asociado a la wishlist"); 
  });

  it('findRegalosByWishlistId debe retornar los regalos por wishlist', async ()=>{
    const regalos: RegaloEntity[] = await service.findRegalosByWishlistId(wishlist.id);
    expect(regalos.length).toBe(5)
  });

  it('findRegalosByWishlistId debe lanzar una excepcion para una wishlist invalida', async () => {
    await expect(()=> service.findRegalosByWishlistId("0")).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada"); 
  });

  it('associateRegalosWishlist debe actualizar la lista de regalos para una wishlist', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    const updatedWishlist: WishlistEntity = await service.associateRegalosWishlist(wishlist.id, [newRegalo]);

    expect(updatedWishlist.regalos.length).toBe(1);
    expect(updatedWishlist.regalos[0].nombre).toBe(newRegalo.nombre)
    expect(updatedWishlist.regalos[0].descripcion).toBe(newRegalo.descripcion)
    expect(updatedWishlist.regalos[0].imagen).toBe(newRegalo.imagen)
    expect(updatedWishlist.regalos[0].precioPromedio).toBe(newRegalo.precioPromedio)
    expect(updatedWishlist.regalos[0].genero).toBe(newRegalo.genero)
    expect(updatedWishlist.regalos[0].calificacionPromedio).toBe(newRegalo.calificacionPromedio)
  });

  it('associateRegalosWishlist debe lanzar una excepcion para una wishlist invalida', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.associateRegalosWishlist("0", [newRegalo])).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada"); 
  });

  it('associateRegalosWishlist debe lanzar una excepcion para un regalo invalido', async () => {
    const newRegalo: RegaloEntity = regalosList[0];
    newRegalo.id = "0";

    await expect(()=> service.associateRegalosWishlist(wishlist.id, [newRegalo])).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('deleteRegaloToWishlist debe eliminar un regalo de una wishlist', async () => {
    const regalo: RegaloEntity = regalosList[0];
    
    await service.deleteRegaloWishlist(wishlist.id, regalo.id);

    const storedWishlist: WishlistEntity = await wishlistRepository.findOne({where: {id: wishlist.id}, relations: ["regalos"]});
    const deletedRegalo: RegaloEntity = storedWishlist.regalos.find(a => a.id === regalo.id);

    expect(deletedRegalo).toBeUndefined();

  });

  it('deleteRegaloToWishlist debe lanzar una excepcion para un regalo invalido', async () => {
    await expect(()=> service.deleteRegaloWishlist(wishlist.id, "0")).rejects.toHaveProperty("message", "El regalo con el ID dado no fue encontrado"); 
  });

  it('deleteRegaloToWishlist debe lanzar una excepcion para una wishlist invalida', async () => {
    const regalo: RegaloEntity = regalosList[0];
    await expect(()=> service.deleteRegaloWishlist("0", regalo.id)).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada"); 
  });

  it('deleteRegaloToWishlist debe lanzar una excepcion para un regalo no asociado  con la wishlist', async () => {
    const newRegalo: RegaloEntity = await regaloRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      precioPromedio: parseFloat(faker.commerce.price()),
      genero: faker.name.sex(),
      calificacionPromedio: faker.datatype.float({ min: 0, max: 5 })
    });

    await expect(()=> service.deleteRegaloWishlist(wishlist.id, newRegalo.id)).rejects.toHaveProperty("message", "El regalo con el ID dado no se encuentra asociado a la wishlist"); 
  }); 
});
