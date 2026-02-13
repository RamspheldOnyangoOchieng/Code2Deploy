import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Program, Prisma } from '@prisma/client';

@Injectable()
export class ProgramsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.program.findMany({
            include: {
                instructor: {
                    select: {
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(slug: string) {
        const program = await this.prisma.program.findUnique({
            where: { slug },
            include: {
                instructor: true,
                enrollments: {
                    take: 5,
                    include: { profile: true },
                },
            },
        });

        if (!program) {
            throw new NotFoundException(`Program with slug ${slug} not found`);
        }

        return program;
    }

    async create(data: Prisma.ProgramCreateInput) {
        return this.prisma.program.create({
            data,
        });
    }
}
