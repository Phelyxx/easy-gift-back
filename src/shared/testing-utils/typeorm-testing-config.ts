import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from '../../resena/resena.entity';
import { CarritoEntity } from '../../carrito/carrito.entity';
import { CategoriaEntity } from '../../categoria/categoria.entity';
import { LocalizacionEntity } from '../../localizacion/localizacion.entity';
import { RegaloEntity } from '../../regalo/regalo.entity';
import { TiendaEntity } from '../../tienda/tienda.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity';
import { WishlistEntity } from '../../wishlist/wishlist.entity';


export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [WishlistEntity, RegaloEntity, CategoriaEntity, CarritoEntity, UsuarioEntity, TiendaEntity, LocalizacionEntity, ResenaEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([WishlistEntity, RegaloEntity, CategoriaEntity, CarritoEntity, UsuarioEntity, TiendaEntity, LocalizacionEntity, ResenaEntity]),
];