import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CertificateType, BadgeType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CertificatesService {
    constructor(private prisma: PrismaService) { }

    // --- Certificates ---
    async issueCertificate(profileId: string, data: {
        title: string;
        type: CertificateType;
        programId?: string;
        eventId?: string;
        skillsCovered?: string[];
        score?: number;
    }) {
        const certificateId = `CERT-${uuidv4().substring(0, 12).toUpperCase()}`;
        return this.prisma.certificate.create({
            data: {
                certificateId,
                profileId,
                title: data.title,
                type: data.type,
                programId: data.programId,
                eventId: data.eventId,
                skillsCovered: data.skillsCovered || [],
                score: data.score,
                status: 'ISSUED',
            },
        });
    }

    async findAllCertificates() {
        return this.prisma.certificate.findMany({
            include: { profile: true, program: true, event: true }
        });
    }

    async findCertificatesByProfile(profileId: string) {
        return this.prisma.certificate.findMany({
            where: { profileId, status: 'ISSUED' },
            include: { program: true, event: true }
        });
    }

    // --- Badges ---
    async awardBadge(profileId: string, data: {
        title: string;
        description: string;
        type: BadgeType;
        icon?: string;
        color?: string;
        points?: number;
        programId?: string;
    }) {
        return this.prisma.badge.upsert({
            where: {
                profileId_title: {
                    profileId,
                    title: data.title
                }
            },
            update: {},
            create: {
                profileId,
                title: data.title,
                description: data.description,
                type: data.type,
                icon: data.icon,
                color: data.color || '#4f46e5',
                points: data.points || 0,
                programId: data.programId,
            }
        });
    }

    async findBadgesByProfile(profileId: string) {
        return this.prisma.badge.findMany({
            where: { profileId },
            include: { program: true }
        });
    }
}
