import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Get, Query } from '@nestjs/common';
import {
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateAppointmentDto,
  ) {
    return this.appointmentService.create(dto);
  }

  @Get()
  getDoctorAppointments(
    @Query('doctorId') doctorId: number,
  ) {
    return this.appointmentService.getDoctorAppointments(
      Number(doctorId),
    );
  }

  @Patch(':id/cancel')
  cancelAppointment(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.appointmentService.cancelAppointment(
      id,
    );
  }
}