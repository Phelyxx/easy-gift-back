import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity'
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CarritoEntity } from '../carrito/carrito.entity';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuariosList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
   repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
   await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const seedDatabase = async () => {
    repository.clear();
    usuariosList = [];
    for(let i = 0; i < 5; i++){
        const usuario: UsuarioEntity = await repository.save({
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
        disponibilidadDeTiempo: faker.lorem.sentence()
        })
        usuariosList.push(usuario);
    }
  }

  it('findAll should return all users', async () => {
    const usuarios: UsuarioEntity[] = await service.findAll();
    expect(usuarios).not.toBeNull();
    expect(usuarios).toHaveLength(usuariosList.length);
  });

  it('findOne should return a user by id', async () => {
    const storedUsuario: UsuarioEntity = usuariosList[0];
    const usuario: UsuarioEntity = await service.findOne(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
    expect(usuario.email).toEqual(storedUsuario.email);
    expect(usuario.bio).toEqual(usuario.bio);
    expect(usuario.usuario).toEqual(storedUsuario.usuario);
    expect(usuario.cumpleanios).toEqual(storedUsuario.cumpleanios);
    expect(usuario.edad).toEqual(storedUsuario.edad);
    expect(usuario.rutaFotoPerfil).toEqual(storedUsuario.rutaFotoPerfil);
    expect(usuario.rutaFotoPortada).toEqual(storedUsuario.rutaFotoPortada);
    expect(usuario.genero).toEqual(storedUsuario.genero);
    expect(usuario.presupuesto).toEqual(storedUsuario.presupuesto);
    expect(usuario.disponibilidadDeTiempo).toEqual(storedUsuario.disponibilidadDeTiempo);

  });
  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado")
  });

  
  

 it('create should return a new user', async () => {
  const usuario: UsuarioEntity = {
    id: "",
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
    amigos: [],
    direcciones: [],
    carrito: new CarritoEntity(),
    resenas: [],
    intereses: [],
    wishlist: []
  }


  const newUsuario: UsuarioEntity = await service.create(usuario);
  expect(newUsuario).not.toBeNull();

  const storeUsuario: UsuarioEntity = await repository.findOne({where: {id: newUsuario.id}})
  expect(storeUsuario).not.toBeNull();
  expect(storeUsuario.nombre).toEqual(newUsuario.nombre);
  expect(storeUsuario.email).toEqual(newUsuario.email);
  expect(storeUsuario.bio).toEqual(newUsuario.bio);
  expect(storeUsuario.usuario).toEqual(newUsuario.usuario);
  expect(storeUsuario.cumpleanios).toEqual(newUsuario.cumpleanios);
  expect(storeUsuario.edad).toEqual(newUsuario.edad);
  expect(storeUsuario.rutaFotoPerfil).toEqual(newUsuario.rutaFotoPerfil);
  expect(storeUsuario.rutaFotoPortada).toEqual(newUsuario.rutaFotoPortada);
  expect(storeUsuario.genero).toEqual(newUsuario.genero);
  expect(storeUsuario.presupuesto).toEqual(newUsuario.presupuesto);
  expect(storeUsuario.disponibilidadDeTiempo).toEqual(newUsuario.disponibilidadDeTiempo);
});

it('update should modify an user', async () => {
  const usuario: UsuarioEntity = usuariosList[0];
  usuario.nombre = "Nuevo nombre";
  usuario.edad = 18;
   const updatedUsuario: UsuarioEntity = await service.update(usuario.id, usuario);
  expect(updatedUsuario).not.toBeNull();
   const storedusuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
  expect(storedusuario).not.toBeNull();
  expect(storedusuario.nombre).toEqual(usuario.nombre)
  expect(storedusuario.edad).toEqual(usuario.edad)
});

it('update should throw an exception for an invalid user', async () => {
  let usuario: UsuarioEntity = usuariosList[0];
  usuario = {
    ...usuario, nombre: "Nuevo nombre", edad: 18
  }
  await expect(() => service.update("0", usuario)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado")
});

it('delete should remove an user', async () => {
  const usuario: UsuarioEntity = usuariosList[0];
  await service.delete(usuario.id);
   const deletedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
  expect(deletedUsuario).toBeNull();
});

it('delete should throw an exception for an invalid museum', async () => {
  const usuario: UsuarioEntity = usuariosList[0];
  await service.delete(usuario.id);
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado")
});





});
