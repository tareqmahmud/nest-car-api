import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const newReport = this.reportRepository.create(reportDto);
    newReport.user = user;
    return this.reportRepository.save(newReport);
  }
}
