import { Injectable } from '@nestjs/common';
import { CategoriaEntity } from '../categoria/categoria.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RegaloCategoriaService {
    /**
     * Servicio para la relacion Regalo-Categoria
     * @param regaloRepository el repositorio del regalo
     * @param categoriaRepository el repositorio de la categoria
     */
    constructor(
        @InjectRepository(RegaloEntity)
        private readonly regaloRepository: Repository<RegaloEntity>,
    
        @InjectRepository(CategoriaEntity)
        private readonly categoriaRepository: Repository<CategoriaEntity>
    ) {}

    /**
     * Agrega una categoria a un regalo
     * @param regaloId el id del regalo al que se agrega la categoria
     * @param categoriaId la categoria a agregar al regalo
     * @throws BusinessLogicException si la categoria o el regalo no son validos
     * @returns el regalo con la nueva categoria agregada
     */
    async addCategoriaRegalo(regaloId: string, categoriaId: string): Promise<RegaloEntity> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        if (!categoria)
          throw new BusinessLogicException("La categoria con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["categorias", "tiendas", "resenas"]})
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        regalo.categorias = [...regalo.categorias, categoria];
        return await this.regaloRepository.save(regalo);
      }
    
    /**
     * Busca una categoria asociada a un regalo determinado
     * @param regaloId el id del regalo al que se quiere encontrar la categoria
     * @param categoriaId el id de la categoria que se busca encontrar de un regalo determinado
     * @throws BusinessLogicException si la categoria o el regalo no son validos, o si la categoria con el ID dado no se encuentra
     * asociada al regalo
     * @returns la categoria asociada al regalo dado por paramentro
     */
    async findCategoriaByRegaloIdCategoriaId(regaloId: string, categoriaId: string): Promise<CategoriaEntity> {
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        if (!categoria)
          throw new BusinessLogicException("La categoria con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
       
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["categorias"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
   
        const regaloCategoria: CategoriaEntity = regalo.categorias.find(e => e.id === categoria.id);
   
        if (!regaloCategoria)
          throw new BusinessLogicException("La categoria con el ID dado no se encuentra asociada al regalo", BusinessError.PRECONDITION_FAILED)
   
        return regaloCategoria;
    }
    
    /**
     * Encuentra las categorias de un regalo determinado
     * @param regaloId el id del regalo del que se buscan sus categorias
     * @throws BusinessLogicException si el regalo con el ID dado no fue encontrado
     * @returns las categorias del regalo
     */
    async findCategoriasByRegaloId(regaloId: string): Promise<CategoriaEntity[]> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["categorias"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
       
        return regalo.categorias;
    }
    
    /**
     * Actualiza las categorias de un regalo determinado
     * @param regaloId el id del regalo al que se le reemplazaran las categorias
     * @param categorias las nuevas categorias que se asociaran al regalo
     * @throws BusinessLogicException si el regalo (o alguna de las categorias) no fueron encontradas en los repositorios
     * @returns el regalo con las categorias actualizadas
     */
    async associateCategoriasRegalo(regaloId: string, categorias: CategoriaEntity[]): Promise<RegaloEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["categorias"]});
    
        if (!regalo)
            throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < categorias.length; i++) {
            const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categorias[i].id}});
            if (!categoria)
                throw new BusinessLogicException("La categoria con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        }
    
        regalo.categorias = categorias;
        return await this.regaloRepository.save(regalo);
      }
    
    /**
     * Elimina una categoria de un regalo determinado
     * @param regaloId el id del regalo del que se quiere eliminar una categoria
     * @param categoriaId el id de la categoria que se busca eliminar 
     * @throws BusinessLogicException si la categoria o el regalo no son validos, o si la categoria con el ID dado no se encuentra
     * asociada al regalo
     */
    async deleteCategoriaRegalo(regaloId: string, categoriaId: string){
        const categoria: CategoriaEntity = await this.categoriaRepository.findOne({where: {id: categoriaId}});
        if (!categoria)
          throw new BusinessLogicException("La categoria con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id: regaloId}, relations: ["categorias"]});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const regaloCategoria: CategoriaEntity = regalo.categorias.find(e => e.id === categoria.id);
    
        if (!regaloCategoria)
            throw new BusinessLogicException("La categoria con el ID dado no se encuentra asociada al regalo", BusinessError.PRECONDITION_FAILED)
 
        regalo.categorias = regalo.categorias.filter(e => e.id !== categoriaId);
        await this.regaloRepository.save(regalo);
    } 
}
