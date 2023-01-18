import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { UsuarioEntity } from '../usuario/usuario.entity';
import { UsuarioWishlistService } from './usuario-wishlist.service';
import { UsuarioWishlistController } from './usuario-wishlist.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [UsuarioWishlistService, JwtService],
  imports: [TypeOrmModule.forFeature([UsuarioEntity, WishlistEntity])],
  controllers: [UsuarioWishlistController],
})
export class UsuarioWishlistModule {}
