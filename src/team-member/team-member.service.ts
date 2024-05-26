import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { PaginationResult, paginate } from './../utils/pagination';


@Injectable()
export class TeamMemberService {
    constructor(
        @InjectModel(TeamMember.name)
        private teamMemberModel: Model<TeamMemberDocument>
    ) { }

    async findAll(page: number = 1, limit: number = 10): Promise<PaginationResult<TeamMemberDocument>> {
        return paginate<TeamMemberDocument>(this.teamMemberModel, page, limit);
    }

    async create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember> {
        try {
            return await this.teamMemberModel.create(createTeamMemberDto);
            // return await newMember.save();
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(`Validation failed: ${Object.values(error.errors).map(err => err).join(', ')}`);
            } else if (error.code === 11000) {
                throw new BadRequestException(`Team member with these details already exists`);
            }
            throw error;
        }
    }

    async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember> {
        try {
            const existingMember = await this.teamMemberModel.findByIdAndUpdate(id, updateTeamMemberDto, { new: true });
            if (!existingMember) {
                throw new NotFoundException(`Team member with id ${id} not found`);
            }
            return existingMember;

        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new BadRequestException(`Validation failed`);
            } else if (error.code === 11000) {
                throw new BadRequestException(`Team member with these details already exists`);
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        const result = await this.teamMemberModel.findByIdAndDelete(id);
        if (!result) {
            throw new NotFoundException(`Team member with id ${id} not found`);
        }
    }
}
