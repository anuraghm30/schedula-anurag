import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Post()
  createRecurringAvailability(
    @Body() dto: CreateRecurringAvailabilityDto,
  ) {
    return this.availabilityService.createRecurringAvailability(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Post('override')
  createCustomAvailability(
    @Body() dto: CreateCustomAvailabilityDto,
  ) {
    return this.availabilityService.createCustomAvailability(dto);
  }

  // MUST COME BEFORE :doctorId
  @Get('custom/:doctorId')
  getCustomAvailability(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
  ) {
    return this.availabilityService.getCustomAvailability(
      doctorId,
    );
  }

  // MUST COME BEFORE :doctorId
  @Get('date')
  getAvailabilityByDate(
    @Query('doctorId', ParseIntPipe)
    doctorId: number,

    @Query('date')
    date: string,
  ) {
    return this.availabilityService.getAvailabilityByDate(
      doctorId,
      date,
    );
  }

  // KEEP THIS AFTER ALL FIXED ROUTES
  @Get(':doctorId')
  getDoctorAvailability(
    @Param('doctorId', ParseIntPipe)
    doctorId: number,
  ) {
    return this.availabilityService.getDoctorAvailability(
      doctorId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Patch(':id')
  updateAvailability(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: CreateRecurringAvailabilityDto,
  ) {
    return this.availabilityService.updateAvailability(
      id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Delete(':id')
  deleteAvailability(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.availabilityService.deleteAvailability(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  @Delete('custom/:id')
  deleteCustomAvailability(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.availabilityService.deleteCustomAvailability(id);
  }
}