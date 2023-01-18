import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RegaloEntity } from './regalo.entity';
@Injectable()
export class RegaloService {
    /**
     * Constructor del metodo del servicio de regalo
     * @param regaloRepository Referencia al repositorio del regalo
     */
     constructor(
        @InjectRepository(RegaloEntity)
        private readonly regaloRepository: Repository<RegaloEntity>
    ){}

    /**
     * Promesa que retorna todos los regalos.
     * @returns Retorna una lista con todos los regalos (y sus relaciones correspondientes).
     */
    async findAll(): Promise<RegaloEntity[]> {
        return await this.regaloRepository.find({ relations: ["tiendas", "categorias", "resenas"] });
    }

    /**
     * Promesa que retorna un regalo con un id determinado. En caso de no encontrarlo, arroja una excepcion de logica de negocio. 
     * @param id del regalo que quiere retornarse
     * @returns El regalo correspondiente al id dado por parametro
     */
    async findOne(id: string): Promise<RegaloEntity> {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where: {id}, relations: ["tiendas", "categorias", "resenas"] } );
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
   
        return regalo;
    }

    /**
     * Crea un regalo
     * @param regalo el regalo a ser creado
     * @returns si se guardo exitosamente, salva el regalo
     */
    async create(regalo: RegaloEntity): Promise<RegaloEntity> {
        // No pueden crearse dos regalos con el mismo nombre
        return await this.regaloRepository.save(regalo);
    }

    /**
     * Actualiza un regalo de un id determinado, con los datos del regalo por parametro
     * @param id del regalo a actualizar
     * @param regalo los nuevos datos que se le asignaran al regalo
     * @returns si se actualizo correctamente, actualiza el regalo
     */
    async update(id: string, regalo: RegaloEntity): Promise<RegaloEntity> {
        const persistedregalo: RegaloEntity = await this.regaloRepository.findOne({where:{id}});
        if (!persistedregalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        return await this.regaloRepository.save({...persistedregalo, ...regalo});
    }

    /**
     * Elimina un regalo determinado, dado su id
     * @param id del regalo a eliminar
     */
    async delete(id: string) {
        const regalo: RegaloEntity = await this.regaloRepository.findOne({where:{id}});
        if (!regalo)
          throw new BusinessLogicException("El regalo con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        await this.regaloRepository.remove(regalo);
    }
}
