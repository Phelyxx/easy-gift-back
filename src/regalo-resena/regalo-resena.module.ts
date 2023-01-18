import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from '../resena/resena.entity';
import { RegaloEntity } from '../regalo/regalo.entity';
import { RegaloResenaService } from './regalo-resena.service';
import { RegaloResenaController } from './regalo-resena.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [RegaloResenaService, JwtService],
  imports: [TypeOrmModule.forFeature([RegaloEntity, ResenaEntity])],
  controllers: [RegaloResenaController],
})
export class RegaloResenaModule {}
