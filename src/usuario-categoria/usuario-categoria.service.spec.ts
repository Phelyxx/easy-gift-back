/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { UsuarioCategoriaService } from './usuario-categoria.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('UsuarioCategoriaService', () => {
  let service: UsuarioCategoriaService;
  let categoriaRepository: Repository<CategoriaEntity>;
  let usuarioRepository: Repository<UsuarioEntity>;
  let usuario: UsuarioEntity;
  let categoriaList : CategoriaEntity[];
  const tipoCategoria = ["moda", "joyeria", "deportes", "libros", "tecnologia", "juguetes"]


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioCategoriaService],
      imports: [...TypeOrmTestingConfig()],

    }).compile();

    service = module.get<UsuarioCategoriaService>(UsuarioCategoriaService);
    categoriaRepository = module.get<Repository<CategoriaEntity>>(getRepositoryToken(CategoriaEntity));
    usuarioRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDataBase();
  });

  

  const seedDataBase = async () => {
    usuarioRepository.clear();
    categoriaRepository.clear();

    categoriaList = []
    for(let i = 0; i < 5; i++){
      const categoria: CategoriaEntity = await categoriaRepository.save({
        nombre: faker.helpers.arrayElement(tipoCategoria),
      });
      categoriaList.push(categoria);
      
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
      intereses: categoriaList
      })
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  it('addCategoriaUsuario should add a resena to a usuario', async () => {
    const newcategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
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

      const result: UsuarioEntity = await service.addCategoriaUsuario(newUsuario.id, newcategoria.id);

      expect(result.intereses.length).toBe(1);
      expect(result.intereses[0]).not.toBeNull();
      expect(result.intereses[0].nombre).toBe(newcategoria.nombre)

  });

  it('addCategoriaaUsuario should thrown exception for an invalid categoria', async () => {
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

    await expect(() => service.addCategoriaUsuario(newUsuario.id, "0")).rejects.toHaveProperty("message", "La categoria con el id dado no existe");
  });


  it('addCategoriaaUsuario should throw an exception for an invalid usuario', async () => {
    const newcategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
    });

    await expect(() => service.addCategoriaUsuario("0", newcategoria.id)).rejects.toHaveProperty("message", "El usuario con el id dado no existe");
  });

  it('findCategoriakByUsuarioIdCategoriaId should return categoria by usuario', async () => {
    const categoria: CategoriaEntity = categoriaList[0];
    const storedCategoria: CategoriaEntity = await service.findCategoriaByUsuarioIdCategoriaId(usuario.id, categoria.id )
    expect(storedCategoria).not.toBeNull();
    expect(storedCategoria.nombre).toBe(categoria.nombre);

  });



  it('findCategoriaByUsuarioIdCategoriaId should throw an exception for an invalid categoria', async () => {
    await expect(()=> service.findCategoriaByUsuarioIdCategoriaId(usuario.id, "0")).rejects.toHaveProperty("message", "La categoria con el id dado no existe"); 
  });

  it('findCategoriaByUsuarioIdCategoriaId should throw an exception for an invalid usuario', async () => {
    const categoria: CategoriaEntity = categoriaList[1]; 
    await expect(()=> service.findCategoriaByUsuarioIdCategoriaId("0", categoria.id)).rejects.toHaveProperty("message", "El usuario con el id dado no existe"); 
  }); 
  it('findCategoriaByUsuarioIdCategoriaId should throw an exception for an artwork not associated to the museum', async () => {
    const newCategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
    });

    await expect(()=> service.findCategoriaByUsuarioIdCategoriaId(usuario.id, newCategoria.id)).rejects.toHaveProperty("message", "La categoria con el id dado no esta asociada al usuario"); 
  });

  it('findCategoriasByUsuarioId should return categoria by usuario', async ()=>{
    const categorias: CategoriaEntity[] = await service.findCategoriasByUsuarioId(usuario.id);
    expect(categorias.length).toBe(5)
  });

  it('findCategoriasByUsuarioId should throw an exception for an invalid usuario', async () => {
    await expect(()=> service.findCategoriasByUsuarioId("0")).rejects.toHaveProperty("message", "El usuario con el id dado no existe"); 
  });

  it('associateCategoriaUsuario should update categoria list for a usuario', async () => {
    const newcategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
    });

    const updateUsuario: UsuarioEntity = await service.associateCategoriaUsuario(usuario.id, [newcategoria]);
    expect(updateUsuario.intereses.length).toBe(1);
    expect(updateUsuario.intereses[0].nombre).toBe(newcategoria.nombre);
  });

  it('associateCategoriaUsuario should throw an exception for an invalid Usuario', async () => {
    const newcategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
    });

    await expect(()=> service.associateCategoriaUsuario("0", [newcategoria])).rejects.toHaveProperty("message", "El usuario con el id dado no existe"); 
  });


  it('associateCategoriaUsuario should throw an exception for an invalid categoria', async () => {
    const newCategoria: CategoriaEntity = categoriaList[0];
    newCategoria.id = "0";

    await expect(()=> service.associateCategoriaUsuario(usuario.id, [newCategoria])).rejects.toHaveProperty("message", "La categoria con el id dado no existe"); 
  });


  it('deleteCategoriaUsuario should remove an categoria from a usuario', async () => {
    const categoria: CategoriaEntity = categoriaList[0];
    
    await service.deleteCategoriaUsuario(usuario.id, categoria.id);

    const storedUsuario: UsuarioEntity = await usuarioRepository.findOne({where: {id: usuario.id}, relations: ["intereses"]});
    const deleteCategoria: CategoriaEntity = storedUsuario.intereses.find(a => a.id === categoria.id);

    expect(deleteCategoria).toBeUndefined();

  });

  it('deleteCategoriaUsuario should thrown an exception for an invalid categoria', async () => {
    await expect(()=> service.deleteCategoriaUsuario(usuario.id, "0")).rejects.toHaveProperty("message", "La categoria con el id dado no existe"); 
  });

  it('deleteCategoriaUsuario should thrown an exception for an invalid usuario', async () => {
    const categoria: CategoriaEntity = categoriaList[0];
    await expect(()=> service.deleteCategoriaUsuario("0", categoria.id)).rejects.toHaveProperty("message", "El usuario con el id dado no existe"); 
  });


  it('deleteCategoriaUsuario should thrown an exception for an non asocciated resena', async () => {
    const newcategoria: CategoriaEntity = await categoriaRepository.save({
      nombre: faker.helpers.arrayElement(tipoCategoria),
    });

    await expect(()=> service.deleteCategoriaUsuario(usuario.id, newcategoria.id)).rejects.toHaveProperty("message", "La categoria con el id dado no esta asociada al usuario"); 
  }); 

});
