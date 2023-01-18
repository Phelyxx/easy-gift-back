import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { WishlistEntity } from './wishlist.entity';
import { WishlistService } from './wishlist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

describe('WishlistService', () => {
  let service: WishlistService;
  let repository: Repository<WishlistEntity>;
  let wishlistsList: WishlistEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [WishlistService],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
    repository = module.get<Repository<WishlistEntity>>(getRepositoryToken(WishlistEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    wishlistsList = [];
    for(let i = 0; i < 5; i++){
        const wishlist: WishlistEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl()})
        wishlistsList.push(wishlist);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /**
   * Prueba para el metodo findAll
   */
  it('findAll debe retornar todas las wishlists', async () => {
    const wishlists: WishlistEntity[] = await service.findAll();
    expect(wishlists).not.toBeNull();
    expect(wishlists).toHaveLength(wishlistsList.length);
  });

  /**
   * Prueba para el metodo findOne
   */
  it('findOne debe retornar una wishlist por id', async () => {
    const storedWishlist: WishlistEntity = wishlistsList[0];
    const wishlist: WishlistEntity = await service.findOne(storedWishlist.id);
    expect(wishlist).not.toBeNull();
    expect(wishlist.nombre).toEqual(storedWishlist.nombre)
    expect(wishlist.descripcion).toEqual(storedWishlist.descripcion)
    expect(wishlist.imagen).toEqual(storedWishlist.imagen)
  });

  /**
   * Prueba (que debe fallar) para el metodo de findOne: intentando encontrar una wishlist que no existe
   */
  it('findOne debe arrojar una excepcion para una wishlist que no existe', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada")
  });

  /**
   * Prueba del metodo create
   */
   it('create debe retornar una nueva wishlist', async () => {
    const wishlist: WishlistEntity = {
      id: "",
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl(),
      regalos: [],
      usuario: new UsuarioEntity()
    }
    // Se crea la wishlist y se espera que no sea nula
    const newWishlist: WishlistEntity = await service.create(wishlist);
    expect(newWishlist).not.toBeNull();
 
    // Busco la wishlist recien creada y verifico que sea la misma
    const storedWishlist: WishlistEntity = await repository.findOne({where: {id: newWishlist.id}})
    expect(storedWishlist).not.toBeNull();
    expect(storedWishlist.nombre).toEqual(newWishlist.nombre)
    expect(storedWishlist.descripcion).toEqual(newWishlist.descripcion)
    expect(storedWishlist.imagen).toEqual(newWishlist.imagen)
  });

  /**
   * Prueba del metodo update
   */
  it('update debe modificar una wishlist', async () => {
    const wishlist: WishlistEntity = wishlistsList[0];
    wishlist.nombre = "Nuevo nombre";
    wishlist.descripcion = "Nueva descripcion";
     const updatedWishlist: WishlistEntity = await service.update(wishlist.id, wishlist);
    expect(updatedWishlist).not.toBeNull();
     const storedWishlist: WishlistEntity = await repository.findOne({ where: { id: wishlist.id } })
    expect(storedWishlist).not.toBeNull();
    expect(storedWishlist.nombre).toEqual(wishlist.nombre)
    expect(storedWishlist.descripcion).toEqual(wishlist.descripcion)
  });

  /**
   * Prueba (que debe fallar) para el metodo update: intentando actualizar una wishlist que no existe
   */
   it('update debe retornar una excepcion para una wishlist invalida', async () => {
    let wishlist: WishlistEntity = wishlistsList[0];
    wishlist = {
      ...wishlist, nombre: "Nuevo nombre", descripcion: "Nueva direccion"
    }
    await expect(() => service.update("0", wishlist)).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada")
  });

  /**
   * Prueba del metodo delete
   */
   it('delete debe remover una wishlist', async () => {
    const wishlist: WishlistEntity = wishlistsList[0];
    await service.delete(wishlist.id);
     const deletedWishlist: WishlistEntity = await repository.findOne({ where: { id: wishlist.id } })
    expect(deletedWishlist).toBeNull();
  });

  /**
   * Prueba (que debe fallar) del metodo delete: intentando eliminar una wishlist que no existe
   */
  it('delete debe lanzar una excepcion para una wishlist invalido', async () => {
    const wishlist: WishlistEntity = wishlistsList[0];
    await service.delete(wishlist.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La wishlist con el ID dado no fue encontrada")
  });

});
