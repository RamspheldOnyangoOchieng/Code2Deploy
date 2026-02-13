import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { ProgramsModule } from './programs/programs.module';
import { AuthModule } from './auth/auth.module';
import { MentorshipModule } from './mentorship/mentorship.module';
import { LearnersModule } from './learners/learners.module';
import { EventsModule } from './events/events.module';
import { PaymentsModule } from './payments/payments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContactModule } from './contact/contact.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProgramsModule,
    MentorshipModule,
    LearnersModule,
    EventsModule,
    PaymentsModule,
    CertificatesModule,
    NotificationsModule,
    ContactModule,
    ApplicationsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
