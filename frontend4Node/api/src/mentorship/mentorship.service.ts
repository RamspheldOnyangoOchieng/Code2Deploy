import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MentorshipService {
    constructor(private prisma: PrismaService) { }

    async getMentorDashboard(mentorId: string) {
        const [stats, sessions, mentees, pendingSubmissions] = await Promise.all([
            this.getStats(mentorId),
            this.getRecentSessions(mentorId),
            this.getMentees(mentorId),
            this.getPendingSubmissions(mentorId),
        ]);

        return {
            stats,
            sessions,
            mentees,
            pendingSubmissions,
        };
    }

    private async getStats(mentorId: string) {
        const [menteesCount, sessionsCount, reviewsCount] = await Promise.all([
            this.prisma.mentorMentee.count({ where: { mentorId, isActive: true } }),
            this.prisma.mentorSession.count({ where: { mentorId, status: 'SCHEDULED' } }),
            this.prisma.assignmentSubmission.count({
                where: {
                    assignment: { mentorId },
                    status: 'SUBMITTED'
                }
            }),
        ]);

        return {
            totalMentees: menteesCount,
            upcomingSessions: sessionsCount,
            pendingReviews: reviewsCount,
            unreadMessages: 0, // Placeholder
        };
    }

    private async getRecentSessions(mentorId: string) {
        return this.prisma.mentorSession.findMany({
            where: { mentorId },
            include: { program: true },
            orderBy: { scheduledAt: 'asc' },
            take: 5,
        });
    }

    private async getMentees(mentorId: string) {
        return this.prisma.mentorMentee.findMany({
            where: { mentorId, isActive: true },
            include: {
                mentee: {
                    select: { id: true, fullName: true, email: true, avatarUrl: true }
                },
                program: true
            },
        });
    }

    private async getPendingSubmissions(mentorId: string) {
        return this.prisma.assignmentSubmission.findMany({
            where: {
                assignment: { mentorId },
                status: 'SUBMITTED'
            },
            include: {
                assignment: true,
                student: {
                    select: { id: true, fullName: true, email: true }
                }
            },
            orderBy: { submittedAt: 'desc' },
            take: 10,
        });
    }

    async createSession(mentorId: string, data: any) {
        return this.prisma.mentorSession.create({
            data: {
                ...data,
                mentorId,
            },
        });
    }
}
