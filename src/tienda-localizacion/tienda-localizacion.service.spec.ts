import { Test, TestingModule } from '@nestjs/testing';
import { LocalizacionEntity } from '../localizacion/localizacion.entity';
import { Repository } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { TiendaLocalizacionService } from './tienda-localizacion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('TiendaLocalizacionService', () => {
  let service: TiendaLocalizacionService;
  let tiendaRepository: Repository<TiendaEntity>;
  let localizacionRepository: Repository<LocalizacionEntity>;
  let tienda: TiendaEntity;
  let localizacion : LocalizacionEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaLocalizacionService],
    }).compile();

    service = module.get<TiendaLocalizacionService>(TiendaLocalizacionService);
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    localizacionRepository = module.get<Repository<LocalizacionEntity>>(getRepositoryToken(LocalizacionEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    localizacionRepository.clear();
    tiendaRepository.clear();

      localizacion = await localizacionRepository.save({
        latitud: parseFloat(faker.address.latitude()),
        longitud: parseFloat(faker.address.longitude()),
        direccion: faker.address.direction(),
        ciudad: faker.address.city(),
        pais: faker.address.country(),
        codigoPostal: faker.address.zipCode(),
        esActual: faker.datatype.boolean(),
      })

    tienda = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
      ubicacion: localizacion
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addLocalizacionTienda should add an localizacion to a tienda', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
      })

    const result: TiendaEntity = await service.addLocalizacionTienda(newTienda.id, newLocalizacion.id);
    
    expect(result.ubicacion).not.toBeNull();
    expect(result.ubicacion.latitud).toBe(newLocalizacion.latitud)
    expect(result.ubicacion.longitud).toBe(newLocalizacion.longitud)
    expect(result.ubicacion.direccion).toBe(newLocalizacion.direccion)
    expect(result.ubicacion.ciudad).toBe(newLocalizacion.ciudad)
    expect(result.ubicacion.pais).toBe(newLocalizacion.pais)
    expect(result.ubicacion.codigoPostal).toBe(newLocalizacion.codigoPostal)
    expect(result.ubicacion.esActual).toBe(newLocalizacion.esActual)


  });

  it('addLocalizacionTienda should thrown exception for an invalid localizacion', async () => {
    
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(),
      imagen: faker.image.imageUrl(),
      descripcion: faker.lorem.sentence(),
      paginaWeb: faker.internet.url(),
      telefono: parseInt(faker.random.numeric(10)),
      })
    await expect(() => service.addLocalizacionTienda(newTienda.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found");
  });

  it('addLocalizacionTienda should throw an exception for an invalid tienda', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(() => service.addLocalizacionTienda("0", newLocalizacion.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('findLocalizacionByTiendaIdLocalizacionId should return localizacion by tienda', async () => {
    const localizacion2: LocalizacionEntity = localizacion;
    const storedLocalizacion: LocalizacionEntity = await service.findLocalizacionByTiendaIdLocalizacionId(tienda.id, localizacion.id, )
  
    expect(storedLocalizacion).not.toBeNull();
    expect(storedLocalizacion.latitud).toBe(localizacion2.latitud)
    expect(storedLocalizacion.longitud).toBe(localizacion2.longitud)
    expect(storedLocalizacion.direccion).toBe(localizacion2.direccion)
    expect(storedLocalizacion.ciudad).toBe(localizacion2.ciudad)
    expect(storedLocalizacion.pais).toBe(localizacion2.pais)
    expect(storedLocalizacion.codigoPostal).toBe(localizacion2.codigoPostal)
    expect(storedLocalizacion.esActual).toBe(localizacion2.esActual)

  });

  it('findLocalizacionByTiendaIdLocalizacionId should throw an exception for an invalid localizacion', async () => {
    await expect(()=> service.findLocalizacionByTiendaIdLocalizacionId(tienda.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('findLocalizacionByTiendaIdLocalizacionId should throw an exception for an invalid tienda', async () => {
    const localizacion2: LocalizacionEntity = localizacion; 
    await expect(()=> service.findLocalizacionByTiendaIdLocalizacionId("0", localizacion2.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findLocalizacionByTiendaIdLocalizacionId should throw an exception for an localizacion not associated to the tienda', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.findLocalizacionByTiendaIdLocalizacionId(tienda.id, newLocalizacion.id)).rejects.toHaveProperty("message", "The localizacion with the given id is not associated to the tienda"); 
  });


  it('associateLocalizacionTienda should update the localizacion for a tienda', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    const updatedTienda: TiendaEntity = await service.associateLocalizacionTienda(tienda.id, newLocalizacion.id);

    expect(updatedTienda.ubicacion.latitud).toBe(newLocalizacion.latitud);
    expect(updatedTienda.ubicacion.longitud).toBe(newLocalizacion.longitud);
    expect(updatedTienda.ubicacion.direccion).toBe(newLocalizacion.direccion);
    expect(updatedTienda.ubicacion.ciudad).toBe(newLocalizacion.ciudad);
    expect(updatedTienda.ubicacion.pais).toBe(newLocalizacion.pais);
    expect(updatedTienda.ubicacion.codigoPostal).toBe(newLocalizacion.codigoPostal);
  });

  it('associateLocalizacionsTienda should throw an exception for an invalid tienda', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.associateLocalizacionTienda("0", newLocalizacion.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('associateLocalizacionsTienda should throw an exception for an invalid localizacion', async () => {

    await expect(()=> service.associateLocalizacionTienda(tienda.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('deleteLocalizacionToTienda should remove an localizacion from a tienda', async () => {
    const newLocalizacion: LocalizacionEntity = localizacion;
    
    await service.deleteLocalizacionTienda(tienda.id, newLocalizacion.id);

    const storedTienda: TiendaEntity = await tiendaRepository.findOne({where: {id: tienda.id}, relations: ["ubicacion"]});
    const deletedLocalizacion: LocalizacionEntity = storedTienda.ubicacion;

    expect(deletedLocalizacion).toBeNull();

  });

  it('deleteLocalizacionToTienda should thrown an exception for an invalid localizacion', async () => {
    await expect(()=> service.deleteLocalizacionTienda(tienda.id, "0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found"); 
  });

  it('deleteLocalizacionToTienda should thrown an exception for an invalid tienda', async () => {
    const newLocalizacion: LocalizacionEntity = localizacion;
    await expect(()=> service.deleteLocalizacionTienda("0", localizacion.id)).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteLocalizacionToTienda should thrown an exception for an non asocciated localizacion', async () => {
    const newLocalizacion: LocalizacionEntity = await localizacionRepository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
    });

    await expect(()=> service.deleteLocalizacionTienda(tienda.id, newLocalizacion.id)).rejects.toHaveProperty("message", "The localizacion with the given id is not associated to the tienda"); 
  }); 

});
