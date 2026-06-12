import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  createRecurringAvailability(
    @Body() dto: CreateRecurringAvailabilityDto,
  ) {
    return this.availabilityService.createRecurringAvailability(dto);
  }

  @Get(':doctorId')
  getDoctorAvailability(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
  ) {
    return this.availabilityService.getDoctorAvailability(
      doctorId,
    );
  }

  @Delete(':id')
  deleteAvailability(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.availabilityService.deleteAvailability(id);
  }

  @Post('custom')
  createCustomAvailability(
    @Body() dto: CreateCustomAvailabilityDto,
  ) {
    return this.availabilityService.createCustomAvailability(dto);
  }

  @Get('custom/:doctorId')
  getCustomAvailability(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
  ) {
    return this.availabilityService.getCustomAvailability(
      doctorId,
    );
  }
}