import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LearnersService {
    constructor(private prisma: PrismaService) { }

    async getLearnerDashboard(profileId: string) {
        const [enrollments, sessions, assignments] = await Promise.all([
            this.getEnrollments(profileId),
            this.getUpcomingSessions(profileId),
            this.getPendingAssignments(profileId),
        ]);

        return {
            enrollments,
            sessions,
            assignments,
            // Aggregated progress could be calculated here
            overallProgress: this.calculateOverallProgress(enrollments),
        };
    }

    private async getEnrollments(profileId: string) {
        return this.prisma.enrollment.findMany({
            where: { profileId },
            include: {
                program: {
                    select: { id: true, title: true, image: true, instructor: true }
                }
            }
        });
    }

    private async getUpcomingSessions(profileId: string) {
        // Sessions where the user is an attendee OR sessions in their enrolled programs
        return this.prisma.mentorSession.findMany({
            where: {
                OR: [
                    { attendees: { some: { profileId } } },
                    { program: { enrollments: { some: { profileId } } } }
                ],
                scheduledAt: { gte: new Date() }
            },
            include: { mentor: true, program: true },
            orderBy: { scheduledAt: 'asc' },
            take: 5
        });
    }

    private async getPendingAssignments(profileId: string) {
        return this.prisma.assignment.findMany({
            where: {
                program: { enrollments: { some: { profileId } } },
                submissions: { none: { studentId: profileId } },
                dueDate: { gte: new Date() }
            },
            include: { program: true },
            orderBy: { dueDate: 'asc' }
        });
    }

    private calculateOverallProgress(enrollments: any[]) {
        if (enrollments.length === 0) return 0;
        const sum = enrollments.reduce((acc, curr) => acc + curr.progress, 0);
        return Math.round(sum / enrollments.length);
    }

    async submitAssignment(studentId: string, assignmentId: string, data: any) {
        return this.prisma.assignmentSubmission.create({
            data: {
                ...data,
                assignmentId,
                studentId,
                status: 'SUBMITTED'
            }
        });
    }
}
