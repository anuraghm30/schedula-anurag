import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UseGuards,
  Req,
  Query,
  Param,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
  ) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  createProfile(
    @Body() dto: CreateDoctorDto,
    @Req() req,
  ) {
    return this.doctorService.create(
      dto,
      req.user.sub,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  getProfile(@Req() req) {
    return this.doctorService.findOneByUserId(
      req.user.sub,
    );
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  updateProfile(
    @Body() dto: UpdateDoctorDto,
    @Req() req,
  ) {
    return this.doctorService.update(
      dto,
      req.user.sub,
    );
  }

  @Get()
  getDoctors(
    @Query('specialization') specialization?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.doctorService.getDoctors(
      specialization,
      search,
      page,
      limit,
    );
  }

  @Get(':id')
  getDoctorById(
    @Param('id') id: number,
  ) {
    return this.doctorService.getDoctorById(
      Number(id),
    );
  }
}