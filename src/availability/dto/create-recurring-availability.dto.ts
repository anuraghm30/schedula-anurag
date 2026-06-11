export class CreateRecurringAvailabilityDto {
  doctorId!: number;
  dayOfWeek!: string;
  startTime!: string;
  endTime!: string;
}