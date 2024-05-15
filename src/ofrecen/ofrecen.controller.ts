import { Controller } from '@nestjs/common';
import { OfrecenService } from './ofrecen.service';

@Controller('ofrecen')
export class OfrecenController {
  constructor(private readonly ofrecenService: OfrecenService) {}
}
