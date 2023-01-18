import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WishlistModule } from './wishlist/wishlist.module';
import { RegaloModule } from './regalo/regalo.module';
import { CarritoModule } from './carrito/carrito.module';
import { CategoriaModule } from './categoria/categoria.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TiendaModule } from './tienda/tienda.module';
import { LocalizacionModule } from './localizacion/localizacion.module';
import { ResenaModule } from './resena/resena.module';
import { ResenaEntity } from './resena/resena.entity';
import { CarritoEntity } from './carrito/carrito.entity';
import { CategoriaEntity } from './categoria/categoria.entity';
import { LocalizacionEntity } from './localizacion/localizacion.entity';
import { RegaloEntity } from './regalo/regalo.entity';
import { TiendaEntity } from './tienda/tienda.entity';
import { UsuarioEntity } from './usuario/usuario.entity';
import { WishlistEntity } from './wishlist/wishlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaUsuarioModule } from './resena-usuario/resena-usuario.module';
import { UsuarioCategoriaModule } from './usuario-categoria/usuario-categoria.module';
import { UsuarioWishlistModule } from './usuario-wishlist/usuario-wishlist.module';
import { RegaloResenaModule } from './regalo-resena/regalo-resena.module';
import { CategoriaRegaloModule } from './categoria-regalo/categoria-regalo.module';
import { CarritoRegaloModule } from './carrito-regalo/carrito-regalo.module';
import { TiendaRegaloModule } from './tienda-regalo/tienda-regalo.module';
import { UsuarioDireccionesModule } from './usuario-direcciones/usuario-direcciones.module';
import { UsuarioUsuarioModule } from './usuario-usuario/usuario-usuario.module';
import { TiendaLocalizacionModule } from './tienda-localizacion/tienda-localizacion.module';
import { WishlistRegaloModule } from './wishlist-regalo/wishlist-regalo.module';
import { RegaloCategoriaModule } from './regalo-categoria/regalo-categoria.module';
import { RegaloTiendaModule } from './regalo-tienda/regalo-tienda.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [WishlistModule, RegaloModule, CategoriaModule, CarritoModule, UsuarioModule,TiendaModule, LocalizacionModule,ResenaModule,
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'easygift',
    entities: [WishlistEntity, RegaloEntity, CategoriaEntity, CarritoEntity, UsuarioEntity, TiendaEntity, LocalizacionEntity, ResenaEntity],
    dropSchema: true,
    synchronize: true,
    keepConnectionAlive: true
  }),
  ResenaUsuarioModule,
  RegaloResenaModule,
  UsuarioWishlistModule,
  UsuarioCategoriaModule,
  CategoriaRegaloModule,
  CarritoRegaloModule,
  TiendaRegaloModule,
  UsuarioDireccionesModule,
  UsuarioUsuarioModule,
  TiendaLocalizacionModule,
  WishlistRegaloModule,
  RegaloCategoriaModule,
  RegaloTiendaModule,
  UserModule,
  AuthModule 
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
