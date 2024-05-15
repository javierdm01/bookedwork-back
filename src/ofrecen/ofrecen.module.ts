import { Module } from '@nestjs/common';
import { OfrecenService } from './ofrecen.service';
import { OfrecenController } from './ofrecen.controller';

@Module({
  controllers: [OfrecenController],
  providers: [OfrecenService],
})
export class OfrecenModule {}
