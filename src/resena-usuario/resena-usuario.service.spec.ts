/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { ResenaEntity } from '../resena/resena.entity';
import { Repository } from 'typeorm';
import { ResenaUsuarioService } from './resena-usuario.service';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';


describe('ResenaUsuarioService', () => {
  let service: ResenaUsuarioService;
  let resenaRepository: Repository<ResenaEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let resenaList : ResenaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResenaUsuarioService],
      imports: [...TypeOrmTestingConfig()],
    }).compile();

    service = module.get<ResenaUsuarioService>(ResenaUsuarioService);
    resenaRepository = module.get<Repository<ResenaEntity>>(getRepositoryToken(ResenaEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDataBase();
    
  });


  const seedDataBase = async () => {
    usuarioRepository.clear();
    resenaRepository.clear();

    resenaList = []
    for(let i = 0; i < 5; i++){
      const resena: ResenaEntity = await resenaRepository.save({
        titulo: faker.company.name(),
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
        calificacion: Number(faker.random.numeric())
      });

      resenaList.push(resena);
      
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
      resenas: resenaList
      })
  }



  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('addResenaUsuario should add a resena to a usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

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

      const result: UsuarioEntity = await service.addResenaUsuario(newUsuario.id, newResena.id);

      expect(result.resenas.length).toBe(1);
      expect(result.resenas[0]).not.toBeNull();
      expect(result.resenas[0].calificacion).toBe(newResena.calificacion)
      expect(result.resenas[0].descripcion).toBe(newResena.descripcion)
      expect(result.resenas[0].fecha).toStrictEqual(newResena.fecha)
      expect(result.resenas[0].titulo).toBe(newResena.titulo)

  });

  it('addResenaUsuario should thrown exception for an invalid resena', async () => {
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

    await expect(() => service.addResenaUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found");
  });


  it('addResenaUsuario should throw an exception for an invalid usuario', async () => {
    const resena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(() => service.addResenaUsuario("0", resena.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });

  it('findResenakByUsuarioIdResenaId should return resena by usuario', async () => {
    const resena: ResenaEntity = resenaList[0];
    const storedResena: ResenaEntity = await service.findResenaByUsuarioIdResenaID(usuario.id, resena.id )
    expect(storedResena).not.toBeNull();
    expect(storedResena.titulo).toBe(resena.titulo);
    expect(storedResena.calificacion).toBe(resena.calificacion);
    expect(storedResena.descripcion).toBe(resena.descripcion);
    expect(storedResena.fecha).toStrictEqual(resena.fecha);
  });


  it('findResenakByUsuarioIdResenaId should throw an exception for an invalid resena', async () => {
    await expect(()=> service.findResenaByUsuarioIdResenaID(usuario.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });

  it('findResenakByUsuarioIdResenaId should throw an exception for an invalid usuario', async () => {
    const resena: ResenaEntity = resenaList[1]; 
    await expect(()=> service.findResenaByUsuarioIdResenaID("0", resena.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  }); 
  it('findResenakByUsuarioIdResenaId should throw an exception for an resena not associated to the usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.findResenaByUsuarioIdResenaID(usuario.id, newResena.id)).rejects.toHaveProperty("message", "The resena with the given id is not associated to the usuario"); 
  });

  it('findResenasIdByUsuarioId should return resenas by usuario', async ()=>{
    const resena: ResenaEntity[] = await service.findResenasByUsuarioId(usuario.id);
    expect(resena.length).toBe(5)
  });

  it('findResenasIdByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findResenasByUsuarioId("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });

  it('associateResenaUsuario should update resenas list for a usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    const updateUsuario: UsuarioEntity = await service.associateResenaUsuario(usuario.id, [newResena]);
    expect(updateUsuario.resenas.length).toBe(1);

    expect(updateUsuario.resenas[0].titulo).toBe(newResena.titulo);
    expect(updateUsuario.resenas[0].calificacion).toBe(newResena.calificacion);
    expect(updateUsuario.resenas[0].descripcion).toBe(newResena.descripcion);
    expect(updateUsuario.resenas[0].fecha).toStrictEqual(newResena.fecha);
  });

  it('associateResenaUsuario should throw an exception for an invalid Usuario', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.associateResenaUsuario("0", [newResena])).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });


  it('associateResenaUsuario should throw an exception for an invalid resena', async () => {
    const newResena: ResenaEntity = resenaList[0];
    newResena.id = "0";

    await expect(()=> service.associateResenaUsuario(usuario.id, [newResena])).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });


  it('deleteResenaUsuario should remove an resena from a usuario', async () => {
    const resena: ResenaEntity = resenaList[0];
    
    await service.deleteResenaUsuario(usuario.id, resena.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["resenas"]});
    const deleteResena: ResenaEntity = storedUsuario.resenas.find(a => a.id === resena.id);

    expect(deleteResena).toBeUndefined();

  });

  it('deleteResenaUsuario should thrown an exception for an invalid resenas', async () => {
    await expect(()=> service.deleteResenaUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "The resena with the given id was not found"); 
  });

  it('deleteResenaUsuario should thrown an exception for an invalid usuario', async () => {
    const resena: ResenaEntity = resenaList[0];
    await expect(()=> service.deleteResenaUsuario("0", resena.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });


  it('deleteResenaUsuario should thrown an exception for an non asocciated resena', async () => {
    const newResena: ResenaEntity = await resenaRepository.save({
      titulo: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
      calificacion: Number(faker.random.numeric())
    });

    await expect(()=> service.deleteResenaUsuario(usuario.id, newResena.id)).rejects.toHaveProperty("message", "The resena with the given id is not associated to the usuario"); 
  }); 

});
