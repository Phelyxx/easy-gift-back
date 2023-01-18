import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioUsuarioService } from './usuario-usuario.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';

describe('UsuarioUsuarioService', () => {
  let service: UsuarioUsuarioService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let amigosList : UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioUsuarioService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<UsuarioUsuarioService>(UsuarioUsuarioService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    
    await seedDatabase();
  });
  const seedDatabase = async () => {
    usuarioRepository.clear();
 
    amigosList = [];
    for(let i = 0; i < 5; i++){
        const amigo: UsuarioEntity = await usuarioRepository.save({
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
        amigosList.push(amigo);
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
        amigos: amigosList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addAmigousuario should add an friend to a user', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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
 
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
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
    })
 
    const result: UsuarioEntity = await service.addAmigousuario(newUsuario.id, newAmigo.id);
   
    expect(result.amigos.length).toBe(1);
    expect(result.amigos[0]).not.toBeNull();
    expect(result.amigos[0].nombre).toEqual(newAmigo.nombre);
    expect(result.amigos[0].email).toEqual(newAmigo.email);
    expect(result.amigos[0].bio).toEqual(newAmigo.bio);
    expect(result.amigos[0].usuario).toEqual(newAmigo.usuario);
    expect(result.amigos[0].cumpleanios).toEqual(newAmigo.cumpleanios);
    expect(result.amigos[0].edad).toEqual(newAmigo.edad);
    expect(result.amigos[0].rutaFotoPerfil).toEqual(newAmigo.rutaFotoPerfil);
    expect(result.amigos[0].rutaFotoPortada).toEqual(newAmigo.rutaFotoPortada);
    expect(result.amigos[0].genero).toEqual(newAmigo.genero);
    expect(result.amigos[0].presupuesto).toEqual(newAmigo.presupuesto);
    expect(result.amigos[0].disponibilidadDeTiempo).toEqual(newAmigo.disponibilidadDeTiempo);
  });
  it('addAmigousuario should thrown exception for an invalid amigo', async () => {
    const newUsuario: UsuarioEntity = await usuarioRepository.save({
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
    })
 
    await expect(() => service.addAmigousuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "El amigo con el id dado no fue encontrado");
  });

  it('addAmigousuario should throw an exception for an invalid usuario', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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
 
    await expect(() => service.addAmigousuario("0", newAmigo.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado");
  });

  it('findamigoByMuseumIdamigoId should return amigo by ususario', async () => {
    const amigo: UsuarioEntity = amigosList[0];
    const storedAmigo: UsuarioEntity = await service.findamigoByusuarioIdamigoId(usuario.id, amigo.id, )
    expect(storedAmigo).not.toBeNull();
    expect(storedAmigo.nombre).toEqual(amigo.nombre);
    expect(storedAmigo.email).toEqual(amigo.email);
    expect(storedAmigo.bio).toEqual(amigo.bio);
    expect(storedAmigo.usuario).toEqual(amigo.usuario);
    expect(storedAmigo.cumpleanios).toEqual(amigo.cumpleanios);
    expect(storedAmigo.edad).toEqual(amigo.edad);
    expect(storedAmigo.rutaFotoPerfil).toEqual(amigo.rutaFotoPerfil);
    expect(storedAmigo.rutaFotoPortada).toEqual(amigo.rutaFotoPortada);
    expect(storedAmigo.genero).toEqual(amigo.genero);
    expect(storedAmigo.presupuesto).toEqual(amigo.presupuesto);
    expect(storedAmigo.disponibilidadDeTiempo).toEqual(amigo.disponibilidadDeTiempo);
  });
  it('findamigoByMuseumIdamigoId should throw an exception for an invalid amigo', async () => {
    await expect(()=> service.findamigoByusuarioIdamigoId(usuario.id, "0")).rejects.toHaveProperty("message", "El amigo con el id dado no fue encontrado"); 
  });

  it('findamigoByMuseumIdamigoId should throw an exception for an invalid user', async () => {
    const amigo: UsuarioEntity = amigosList[0]; 
    await expect(()=> service.findamigoByusuarioIdamigoId("0", amigo.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado"); 
  });

  it('ffindamigoByMuseumIdamigoId should throw an exception for an amigo not associated to the ususario', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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

    await expect(()=> service.findamigoByusuarioIdamigoId(usuario.id, newAmigo.id)).rejects.toHaveProperty("message", "El amigo con el id dado no esta asociado a ese usuario"); 
  });

  it('findamigosByusuarioId hould return amigos by museum', async ()=>{
    const amigos: UsuarioEntity[] = await service.findamigosByusuarioId(usuario.id);
    expect(amigos.length).toBe(5)
  });

  it('findamigosByusuarioId should throw an exception for an invalid user', async () => {
    await expect(()=> service.findamigosByusuarioId("0")).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado"); 
  });

  it('associateAmigosUsuario should update amigoslist for a usuario', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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
    });

    const updatedUsuario: UsuarioEntity = await service.associateAmigosUsuario(usuario.id, [newAmigo]);
    expect(updatedUsuario.amigos.length).toBe(1);

    expect(updatedUsuario.amigos[0].nombre).toEqual(newAmigo.nombre);
    expect(updatedUsuario.amigos[0].email).toEqual(newAmigo.email);
    expect(updatedUsuario.amigos[0].bio).toEqual(newAmigo.bio);
    expect(updatedUsuario.amigos[0].usuario).toEqual(newAmigo.usuario);
    expect(updatedUsuario.amigos[0].cumpleanios).toEqual(newAmigo.cumpleanios);
    expect(updatedUsuario.amigos[0].edad).toEqual(newAmigo.edad);
    expect(updatedUsuario.amigos[0].rutaFotoPerfil).toEqual(newAmigo.rutaFotoPerfil);
    expect(updatedUsuario.amigos[0].rutaFotoPortada).toEqual(newAmigo.rutaFotoPortada);
    expect(updatedUsuario.amigos[0].genero).toEqual(newAmigo.genero);
    expect(updatedUsuario.amigos[0].presupuesto).toEqual(newAmigo.presupuesto);
    expect(updatedUsuario.amigos[0].disponibilidadDeTiempo).toEqual(newAmigo.disponibilidadDeTiempo);

  });

  it('associateAmigosUsuario should throw an exception for an invalid usuario', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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
    });

    await expect(()=> service.associateAmigosUsuario("0", [newAmigo])).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado"); 
  });

  it('associateAmigosUsuario should throw an exception for an invalid amigo', async () => {
    const newAmigo: UsuarioEntity = amigosList[0];
    newAmigo.id = "0";

    await expect(()=> service.associateAmigosUsuario(usuario.id, [newAmigo])).rejects.toHaveProperty("message", "El amigo con el id dado no fue encontrado"); 
  });

  it('deleteAmigoUsuario should remove an amigo from a usuario', async () => {
    const amigo: UsuarioEntity= amigosList[0];
    
    await service.deleteAmigoUsuario(usuario.id, amigo.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["direcciones", "amigos", "carrito", "resenas", "intereses", "wishlist"]});
    const deletedArtwork: UsuarioEntity= storedUsuario.amigos.find(a => a.id === amigo.id);

    expect(deletedArtwork).toBeUndefined();

  });

  it('deleteAmigoUsuarioshould thrown an exception for an invalid amigo', async () => {
    await expect(()=> service.deleteAmigoUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "El amigo con el id dado no fue encontrado"); 
  });

  it('deleteAmigoUsuarioshould thrown an exception for an invalid museum', async () => {
    const amigo: UsuarioEntity= amigosList[0];
    await expect(()=> service.deleteAmigoUsuario("0", amigo.id)).rejects.toHaveProperty("message", "El usuario con el id dado no fue encontrado"); 
  });

  it('deleteAmigoUsuarioshould thrown an exception for an non asocciated amigo', async () => {
    const newAmigo: UsuarioEntity = await usuarioRepository.save({
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
    });

    await expect(()=> service.deleteAmigoUsuario(usuario.id, newAmigo.id)).rejects.toHaveProperty("message", "El amigo con el id dado no esta asociado al usuario"); 
  }); 


    


});
