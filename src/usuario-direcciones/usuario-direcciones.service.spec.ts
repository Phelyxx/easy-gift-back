
import { Test, TestingModule } from '@nestjs/testing';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuarioDireccionesService } from './usuario-direcciones.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UsuarioDireccionesService', () => {
  let service: UsuarioDireccionesService;
  let usuarioRepository: Repository<UsuarioEntity>;
  let localizacionRepository: Repository<LocalizacionEntity>;
  let usuario: UsuarioEntity;
  let direccionesList : LocalizacionEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioDireccionesService],
    }).compile();

    service = module.get<UsuarioDireccionesService>(UsuarioDireccionesService);
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    localizacionRepository = module.get<Repository<LocalizacionEntity>>(getRepositoryToken(LocalizacionEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    localizacionRepository.clear();
    usuarioRepository.clear();

    direccionesList = [];
    for(let i = 0; i < 5; i++){
      const localizacion: LocalizacionEntity = await localizacionRepository.save({
        latitud: parseFloat(faker.address.latitude()),
        longitud: parseFloat(faker.address.longitude()),
        direccion: faker.address.direction(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        codigoPostal: faker.address.zipCode(),
        esActual: faker.datatype.boolean(),
        })
        direccionesList.push(localizacion);
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
        direcciones: direccionesList
      })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addLocalizacionUsuario should add an localizacion to a usuario', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
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

    const result: UsuarioEntity = await service.addLocalizacionUsuario(newUsuario.id, newLocalizacion.id);
    
    expect(result.direcciones.length).toBe(1);
    expect(result.direcciones[0]).not.toBeNull();
    expect(result.direcciones[0].latitud).toBe(newLocalizacion.latitud)
    expect(result.direcciones[0].longitud).toBe(newLocalizacion.longitud)
    expect(result.direcciones[0].direccion).toBe(newLocalizacion.direccion)
    expect(result.direcciones[0].ciudad).toBe(newLocalizacion.ciudad)
    expect(result.direcciones[0].pais).toBe(newLocalizacion.pais)
    expect(result.direcciones[0].codigoPostal).toBe(newLocalizacion.codigoPostal)
    expect(result.direcciones[0].esActual).toBe(newLocalizacion.esActual)
  });

  it('addLocalizacionUsuario should thrown exception for an invalid localizacion', async () => {
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
      esActual: faker.datatype.boolean(),
    })

    await expect(() => service.addLocalizacionUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found");
  });

  it('addLocalizacionUsuario should throw an exception for an invalid usuario', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(() => service.addLocalizacionUsuario("0", newLocalizacion.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found");
  });

  it('findLocalizacionByUsuarioIdLocalizacionId should return localizacion by usuario', async () => {
    const localizacion: LocalizacionEntity = direccionesList[0];
    const storedLocalizacion: LocalizacionEntity = await service.findLocalizacionByUsuarioIdLocalizacionId(usuario.id, localizacion.id, )
    expect(storedLocalizacion).not.toBeNull();
    expect(storedLocalizacion.latitud).toBe(localizacion.latitud)
    expect(storedLocalizacion.longitud).toBe(localizacion.longitud)
    expect(storedLocalizacion.direccion).toBe(localizacion.direccion)
    expect(storedLocalizacion.ciudad).toBe(localizacion.ciudad)
    expect(storedLocalizacion.pais).toBe(localizacion.pais)
    expect(storedLocalizacion.codigoPostal).toBe(localizacion.codigoPostal)
    expect(storedLocalizacion.esActual).toBe(localizacion.esActual)
  });

  it('findLocalizacionByUsuarioIdLocalizacionId should throw an exception for an invalid localizacion', async () => {
    await expect(()=> service.findLocalizacionByUsuarioIdLocalizacionId(usuario.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('findLocalizacionByUsuarioIdLocalizacionId should throw an exception for an invalid usuario', async () => {
    const localizacion: LocalizacionEntity = direccionesList[0]; 
    await expect(()=> service.findLocalizacionByUsuarioIdLocalizacionId("0", localizacion.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });

  it('findLocalizacionByUsuarioIdLocalizacionId should throw an exception for an localizacion not associated to the usuario', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.findLocalizacionByUsuarioIdLocalizacionId(usuario.id, newLocalizacion.id)).rejects.toHaveProperty("message", "The localizacion with the given id is not associated to the usuario"); 
  });

  it('findLocalizacionsByUsuarioId should return direcciones by usuario', async ()=>{
    const direcciones: LocalizacionEntity[] = await service.findLocalizacionsByUsuarioId(usuario.id);
    expect(direcciones.length).toBe(5)
  });

  it('findLocalizacionsByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findLocalizacionsByUsuarioId("0")).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });

  it('associateLocalizacionsUsuario should update direcciones list for a usuario', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    const updatedUsuario: UsuarioEntity = await service.associateLocalizacionsUsuario(usuario.id, [newLocalizacion]);
    
    expect(updatedUsuario.direcciones.length).toBe(1);
    expect(updatedUsuario.direcciones[0]).not.toBeNull();
    expect(updatedUsuario.direcciones[0].latitud).toBe(newLocalizacion.latitud)
    expect(updatedUsuario.direcciones[0].longitud).toBe(newLocalizacion.longitud)
    expect(updatedUsuario.direcciones[0].direccion).toBe(newLocalizacion.direccion)
    expect(updatedUsuario.direcciones[0].ciudad).toBe(newLocalizacion.ciudad)
    expect(updatedUsuario.direcciones[0].pais).toBe(newLocalizacion.pais)
    expect(updatedUsuario.direcciones[0].codigoPostal).toBe(newLocalizacion.codigoPostal)
    expect(updatedUsuario.direcciones[0].esActual).toBe(newLocalizacion.esActual)

  });

  it('associateLocalizacionsUsuario should throw an exception for an invalid usuario', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.associateLocalizacionsUsuario("0", [newLocalizacion])).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });

  it('associateLocalizacionsUsuario should throw an exception for an invalid localizacion', async () => {
    const newLocalizacion: LocalizacionEntity = direccionesList[0];
    newLocalizacion.id = "0";

    await expect(()=> service.associateLocalizacionsUsuario(usuario.id, [newLocalizacion])).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('deleteLocalizacionToUsuario should remove an localizacion from a usuario', async () => {
    const localizacion: LocalizacionEntity = direccionesList[0];
    
    await service.deleteLocalizacionUsuario(usuario.id, localizacion.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["direcciones"]});
    const deletedLocalizacion: LocalizacionEntity = storedUsuario.direcciones.find(a => a.id === localizacion.id);

    expect(deletedLocalizacion).toBeUndefined();

  });

  it('deleteLocalizacionToUsuario should thrown an exception for an invalid localizacion', async () => {
    await expect(()=> service.deleteLocalizacionUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('deleteLocalizacionToUsuario should thrown an exception for an invalid usuario', async () => {
    const localizacion: LocalizacionEntity = direccionesList[0];
    await expect(()=> service.deleteLocalizacionUsuario("0", localizacion.id)).rejects.toHaveProperty("message", "The usuario with the given id was not found"); 
  });

  it('deleteLocalizacionToUsuario should thrown an exception for an non asocciated localizacion', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.deleteLocalizacionUsuario(usuario.id, newLocalizacion.id)).rejects.toHaveProperty("message", "The localizacion with the given id is not associated to the usuario"); 
  }); 

});