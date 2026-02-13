import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationType, Priority } from '@prisma/client';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(profileId: string, data: {
        type: NotificationType;
        title: string;
        message: string;
        priority?: Priority;
        actionUrl?: string;
        actionText?: string;
        programId?: string;
    }) {
        return this.prisma.notification.create({
            data: {
                profileId,
                type: data.type,
                title: data.title,
                message: data.message,
                priority: data.priority || 'MEDIUM',
                actionUrl: data.actionUrl,
                actionText: data.actionText,
                programId: data.programId,
            }
        });
    }

    async findByProfile(profileId: string) {
        return this.prisma.notification.findMany({
            where: { profileId, status: { not: 'ARCHIVED' } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: {
                status: 'READ',
                readAt: new Date()
            }
        });
    }

    async archive(id: string) {
        return this.prisma.notification.update({
            where: { id },
            data: { status: 'ARCHIVED' }
        });
    }

    // --- Preferences ---
    async getPreferences(profileId: string) {
        return this.prisma.notificationPreference.upsert({
            where: { profileId },
            update: {},
            create: { profileId }
        });
    }

    async updatePreferences(profileId: string, data: any) {
        return this.prisma.notificationPreference.update({
            where: { profileId },
            data: data
        });
    }
}
