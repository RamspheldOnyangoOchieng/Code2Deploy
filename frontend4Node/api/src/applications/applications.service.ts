import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
    constructor(private prisma: PrismaService) { }

    async create(profileId: string, data: { programId?: string; eventId?: string; notes?: string }) {
        return this.prisma.application.create({
            data: {
                profileId,
                programId: data.programId,
                eventId: data.eventId,
                notes: data.notes,
            },
        });
    }

    async findAll() {
        return this.prisma.application.findMany({
            include: {
                profile: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                program: true,
                event: true,
            },
        });
    }

    async findByProfile(profileId: string) {
        return this.prisma.application.findMany({
            where: { profileId },
            include: {
                program: true,
                event: true,
            },
        });
    }

    async updateStatus(id: string, status: ApplicationStatus) {
        return this.prisma.application.update({
            where: { id },
            data: { status },
        });
    }

    async findOne(id: string) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                profile: true,
                program: true,
                event: true,
            },
        });
        if (!application) throw new NotFoundException('Application not found');
        return application;
    }
}
