import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ContactType, ContactStatus } from '@prisma/client';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        name: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
        type?: ContactType;
        profileId?: string;
        ipAddress?: string;
        userAgent?: string;
    }) {
        return this.prisma.contactMessage.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
                type: data.type || 'GENERAL',
                profileId: data.profileId,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            }
        });
    }

    async findAll() {
        return this.prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
            include: { profile: true }
        });
    }

    async updateStatus(id: string, status: ContactStatus) {
        return this.prisma.contactMessage.update({
            where: { id },
            data: { status }
        });
    }
}
