import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { LocalizacionEntity } from './localizacion.entity';
import { LocalizacionService } from './localizacion.service';
import { faker } from '@faker-js/faker';



describe('LocalizacionService', () => {
 let service: LocalizacionService;
 let repository: Repository<LocalizacionEntity>;
 let localizacionsList: LocalizacionEntity[];
 

 beforeEach(async () => {
   const module: TestingModule = await Test.createTestingModule({
     imports: [...TypeOrmTestingConfig()],
     providers: [LocalizacionService],
   }).compile();

   service = module.get<LocalizacionService>(LocalizacionService);
   repository = module.get<Repository<LocalizacionEntity>>(getRepositoryToken(LocalizacionEntity));
   await seedDatabase();
 });
 
 const seedDatabase = async () => {
  repository.clear();
  localizacionsList = []; //  var?
  for(let i = 0; i < 5; i++){
      const localizacion: LocalizacionEntity = await repository.save({
      latitud: parseFloat(faker.address.latitude()),
      longitud: parseFloat(faker.address.longitude()),
      direccion: faker.address.direction(),
      ciudad: faker.address.city(),
      pais: faker.address.country(),
      codigoPostal: faker.address.zipCode(),
      esActual: faker.datatype.boolean(),
      })
      localizacionsList.push(localizacion);
  }
} 


 it('should be defined', () => {
   expect(service).toBeDefined();
 });

 // ----Logic tests-----

 it('findAll should return all localizacions', async () => {
  const localizacions: LocalizacionEntity[] = await service.findAll();
  expect(localizacions).not.toBeNull();
  expect(localizacions).toHaveLength(localizacionsList.length);
});

it('findOne should return a localizacion by id', async () => {
  const storedLocalizacion: LocalizacionEntity = localizacionsList[0];
  const localizacion: LocalizacionEntity = await service.findOne(storedLocalizacion.id);
  expect(localizacion).not.toBeNull();
  expect(localizacion.latitud).toEqual(storedLocalizacion.latitud)
  expect(localizacion.longitud).toEqual(storedLocalizacion.longitud)
  expect(localizacion.direccion).toEqual(storedLocalizacion.direccion)
  expect(localizacion.ciudad).toEqual(storedLocalizacion.ciudad)
  expect(localizacion.pais).toEqual(storedLocalizacion.pais)
  expect(localizacion.codigoPostal).toEqual(storedLocalizacion.codigoPostal)
  expect(localizacion.esActual).toEqual(storedLocalizacion.esActual)
});

it('findOne should throw an exception for an invalid localizacion', async () => {
  await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found")
});

it('create should return a new localizacion', async () => {
  const localizacion: LocalizacionEntity = {
    id: "",
    latitud: parseFloat(faker.address.latitude()),
    longitud: parseFloat(faker.address.longitude()),
    direccion: faker.address.direction(),
    ciudad: faker.address.city(),
    pais: faker.address.country(),
    codigoPostal: faker.address.zipCode(),
    esActual: faker.datatype.boolean(),
    tienda: null,
    usuario: null
  }

  const newLocalizacion: LocalizacionEntity = await service.create(localizacion);
  expect(newLocalizacion).not.toBeNull();

  const storedLocalizacion: LocalizacionEntity = await repository.findOne({where: {id: newLocalizacion.id}})
  expect(localizacion).not.toBeNull();
  expect(localizacion.latitud).toEqual(storedLocalizacion.latitud)
  expect(localizacion.longitud).toEqual(storedLocalizacion.longitud)
  expect(localizacion.direccion).toEqual(storedLocalizacion.direccion)
  expect(localizacion.ciudad).toEqual(storedLocalizacion.ciudad)
  expect(localizacion.pais).toEqual(storedLocalizacion.pais)
  expect(localizacion.codigoPostal).toEqual(storedLocalizacion.codigoPostal)
  expect(localizacion.esActual).toEqual(storedLocalizacion.esActual)
});

it('update should modify a localizacion', async () => {
  const localizacion: LocalizacionEntity = localizacionsList[0];
  localizacion.direccion = "New direccion";
  localizacion.codigoPostal = "321000";

  const updatedLocalizacion: LocalizacionEntity = await service.update(localizacion.id, localizacion);
  expect(updatedLocalizacion).not.toBeNull();

  const storedLocalizacion: LocalizacionEntity = await repository.findOne({ where: { id: localizacion.id } })
  expect(storedLocalizacion).not.toBeNull();
  expect(storedLocalizacion.direccion).toEqual(localizacion.direccion)
  expect(storedLocalizacion.codigoPostal).toEqual(localizacion.codigoPostal)
});

it('update should throw an exception for an invalid localizacion', async () => {
  let localizacion: LocalizacionEntity = localizacionsList[0];
  localizacion = {
    ...localizacion, direccion: "New direccion", codigoPostal: "3210000"
  }
  await expect(() => service.update("0", localizacion)).rejects.toHaveProperty("message", "The localizacion with the given id was not found")
});

it('delete should remove a localizacion', async () => {
  const localizacion: LocalizacionEntity = localizacionsList[0];
  await service.delete(localizacion.id);

  const deletedLocalizacion: LocalizacionEntity = await repository.findOne({ where: { id: localizacion.id } })
  expect(deletedLocalizacion).toBeNull();
});

it('delete should throw an exception for an invalid localizacion', async () => {
  const localizacion: LocalizacionEntity = localizacionsList[0];
  await service.delete(localizacion.id);
  await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The localizacion with the given id was not found")
});

});