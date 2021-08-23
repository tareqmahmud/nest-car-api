import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimatedDto } from './dto/get-estimated.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  getEstimate({ make, lng, lat, year, millage }: GetEstimatedDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('*')
      .where('make = :make', { make })
      .where('lng - :lng BETWEEN -5 AND 5', { lng })
      .where('lat - :lat BETWEEN -5 AND 5', { lat })
      .where('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(millage - :millage)', 'DESC')
      .setParameters({ millage })
      .getRawMany();
  }

  create(reportDto: CreateReportDto, user: User) {
    const newReport = this.reportRepository.create(reportDto);
    newReport.user = user;
    return this.reportRepository.save(newReport);
  }

  async changeApproval(id: string, approve: boolean) {
    const report = await this.reportRepository.findOne(id);

    if (!report) {
      throw new NotFoundException('No report found');
    }

    report.approve = approve;

    return this.reportRepository.save(report);
  }
}
