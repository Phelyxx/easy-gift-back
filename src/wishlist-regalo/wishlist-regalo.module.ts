import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegaloEntity } from '../regalo/regalo.entity';
import { WishlistEntity } from '../wishlist/wishlist.entity';
import { WishlistRegaloService } from './wishlist-regalo.service';
import { WishlistRegaloController } from './wishlist-regalo.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity, RegaloEntity])],
  providers: [WishlistRegaloService, JwtService],
  controllers: [WishlistRegaloController]
})
export class WishlistRegaloModule {}
