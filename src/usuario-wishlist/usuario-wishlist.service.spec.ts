/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { UsuarioWishlistService } from './usuario-wishlist.service';

describe('UsuarioWishlistService', () => {
  let service: UsuarioWishlistService;
  let wishlistRepository: Repository<WishlistEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let wishlistList : WishlistEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioWishlistService],
      imports: [...TypeOrmTestingConfig()],

    }).compile();

    service = module.get<UsuarioWishlistService>(UsuarioWishlistService);
    wishlistRepository = module.get<Repository<WishlistEntity>>(getRepositoryToken(WishlistEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDataBase();
  });

  const seedDataBase = async () => {
    usuarioRepository.clear();
    wishlistRepository.clear();

    wishlistList = []
    for(let i = 0; i < 5; i++){
      const wishlist: WishlistEntity = await wishlistRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        imagen: faker.image.imageUrl()})
      wishlistList.push(wishlist);
      
    }

    usuario = await usuarioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      usuario: faker.name.fullName(),
      cumpleanios: faker.date.birthdate(),
      edad: faker.datatype.number(),
      rutaFotoPerfil: faker.image.imageUrl(),
      rutaFotoPortada: faker.image.imageUrl(),
      genero: faker.name.gender(),
      presupuesto: faker.datatype.number(),
      disponibilidadDeTiempo: faker.lorem.sentence(),
      wishlist: wishlistList
      })
  };


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  
  it('addWishlistUsuario should add a wishlist to a usuario', async () => {
    const wishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()})

    const newUsuario : UsuarioEntity = await usuarioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      usuario: faker.name.fullName(),
      cumpleanios: faker.date.birthdate(),
      edad: faker.datatype.number(),
      rutaFotoPerfil: faker.image.imageUrl(),
      rutaFotoPortada: faker.image.imageUrl(),
      genero: faker.name.gender(),
      presupuesto: faker.datatype.number(),
      disponibilidadDeTiempo: faker.lorem.sentence(),
      });

      const result: UsuarioEntity = await service.addWishlistUsuario(newUsuario.id, wishlist.id);

      expect(result.wishlist.length).toBe(1);
      expect(result.wishlist[0]).not.toBeNull();
      expect(result.wishlist[0].descripcion).toBe(wishlist.descripcion)
      expect(result.wishlist[0].imagen).toBe(wishlist.imagen)
      expect(result.wishlist[0].nombre).toBe(wishlist.nombre)

  });

  it('addWishlistUsuario should thrown exception for an invalid wishlist', async () => {
    const newUsuario : UsuarioEntity = await usuarioRepository.save({
      nombre: faker.name.fullName(),
      email: faker.internet.email(),
      bio: faker.lorem.sentence(),
      usuario: faker.name.fullName(),
      cumpleanios: faker.date.birthdate(),
      edad: faker.datatype.number(),
      rutaFotoPerfil: faker.image.imageUrl(),
      rutaFotoPortada: faker.image.imageUrl(),
      genero: faker.name.gender(),
      presupuesto: faker.datatype.number(),
      disponibilidadDeTiempo: faker.lorem.sentence(),
      });

    await expect(() => service.addWishlistUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "The wishlist with the given id was not found");
  });


  it('addWishlistUsuario should throw an exception for an invalid usuario', async () => {
    const newwishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()})

    await expect(() => service.addWishlistUsuario("0", newwishlist.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });

  it('findwishlistByUsuarioIdWishListId should return wishlist by usuario', async () => {
    const wishlist: WishlistEntity = wishlistList[0];
    const storedWishlist: WishlistEntity = await service.findwishlistByUsuarioIdWishlistId(usuario.id, wishlist.id )
    expect(storedWishlist).not.toBeNull();
    expect(storedWishlist.descripcion).toBe(wishlist.descripcion)
    expect(storedWishlist.imagen).toBe(wishlist.imagen)
    expect(storedWishlist.nombre).toBe(wishlist.nombre)
  });


  it('findwishlistByUsuarioIdWishListId should throw an exception for an invalid wsihlist', async () => {
    await expect(()=> service.findwishlistByUsuarioIdWishlistId(usuario.id, "0")).rejects.toHaveProperty("message", "The wishlist with the given id was not found"); 
  });

  it('findResenakByUsuarioIdCategoriaId should throw an exception for an invalid usuario', async () => {
    const wishlist: WishlistEntity = wishlistList[1]; 
    await expect(()=> service.findwishlistByUsuarioIdWishlistId("0", wishlist.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  }); 

  it('findArtworkByMuseumIdArtworkId should throw an exception for an artwork not associated to the museum', async () => {
    const wishlist: WishlistEntity= await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()
    });

    await expect(()=> service.findwishlistByUsuarioIdWishlistId(usuario.id, wishlist.id)).rejects.toHaveProperty("message", "The wishlist with the given id is not associated to the usuario"); 
  });
  
  it('findWishlistsByUsuarioId should return wishlist by usuario', async ()=>{
    const wishlist: WishlistEntity[] = await service.findWishlistsByUsuarioId(usuario.id);
    expect(wishlist.length).toBe(5)
  });

  it('findWishlistsByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findWishlistsByUsuarioId("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });


  it('associateWishlistUsuario should update categoria list for a usuario', async () => {
    const newwishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()})

    const updateUsuario: UsuarioEntity = await service.associateWishlistUsuario(usuario.id, [newwishlist]);
    expect(updateUsuario.wishlist.length).toBe(1);
    expect(updateUsuario.wishlist[0].descripcion).toBe(newwishlist.descripcion);
    expect(updateUsuario.wishlist[0].imagen).toBe(newwishlist.imagen);
    expect(updateUsuario.wishlist[0].nombre).toBe(newwishlist.nombre);

  });

  it('associateWishlistUsuario should throw an exception for an invalid Usuario', async () => {
    const newwishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()})

    await expect(()=> service.associateWishlistUsuario("0", [newwishlist])).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });


  it('associateWishlistUsuario should throw an exception for an invalid wishlist', async () => {
    const newWishlist: WishlistEntity = wishlistList[0];
    newWishlist.id = "0";

    await expect(()=> service.associateWishlistUsuario(usuario.id, [newWishlist])).rejects.toHaveProperty("message", "The wishlist with the given id was not found"); 
  });


  it('deleteWishlistUsuario should remove an categoria from a usuario', async () => {
    const wishlist: WishlistEntity = wishlistList[0];
    
    await service.deleteWishlistUsuario(usuario.id, wishlist.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["wishlist"]});
    const deletedWishlist: WishlistEntity = storedUsuario.wishlist.find(a => a.id === wishlist.id);

    expect(deletedWishlist).toBeUndefined();

  });

  it('deleteCategoriaUsuario should thrown an exception for an invalid categoria', async () => {
    await expect(()=> service.deleteWishlistUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "The wishlist with the given id was not found"); 
  });

  it('deleteCategoriaUsuario should thrown an exception for an invalid usuario', async () => {
    const wishlist: WishlistEntity = wishlistList[0];
    await expect(()=> service.deleteWishlistUsuario("0", wishlist.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });


  it('deleteResenaUsuario should thrown an exception for an non asocciated resena', async () => {
    const newwishlist: WishlistEntity = await wishlistRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      imagen: faker.image.imageUrl()})

    await expect(()=> service.deleteWishlistUsuario(usuario.id, newwishlist.id)).rejects.toHaveProperty("message", "The wishlist with the given id is not associated to the usuario"); 
  }); 

  

});
