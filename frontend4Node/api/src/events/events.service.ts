import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: { date: 'asc' },
        });
    }

    async findOne(slug: string) {
        const event = await this.prisma.event.findUnique({
            where: { slug },
            include: {
                applications: {
                    include: { profile: true },
                },
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with slug ${slug} not found`);
        }

        return event;
    }

    async create(data: Prisma.EventCreateInput) {
        return this.prisma.event.create({ data });
    }

    async update(id: string, data: Prisma.EventUpdateInput) {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.event.delete({ where: { id } });
    }
}
