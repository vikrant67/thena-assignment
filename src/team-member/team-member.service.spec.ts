import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMemberService } from './team-member.service';
import { Role, TeamMember, TeamMemberDocument } from './schemas/team-member.schema';
import { CreateTeamMemberDto } from './dto/create-team-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockTeamMember = {
    _id: 'mockId',
    firstName: 'Mock',
    lastName: 'Name',
    phoneNumber: '1234567890',
    email: 'mock@gmail.com',
    role: Role.USER,
};

const mockTeamMemberDocument = (mock?: Partial<TeamMember>): Partial<TeamMemberDocument> => ({
    ...mock
});

const mockTeamMemberModel = {
    create: jest.fn().mockResolvedValue(mockTeamMember),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
    countDocuments: jest.fn()
};

describe('TeamMemberService', () => {
    let service: TeamMemberService;
    let model: Model<TeamMemberDocument>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TeamMemberService,
                {
                    provide: getModelToken(TeamMember.name),
                    useValue: mockTeamMemberModel,
                },
            ],
        }).compile();

        service = module.get<TeamMemberService>(TeamMemberService);
        model = module.get<Model<TeamMemberDocument>>(getModelToken(TeamMember.name));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new team member', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockTeamMemberDocument(mockTeamMember) as any));
            const createTeamMemberDto: CreateTeamMemberDto = {
                firstName: 'test',
                lastName: 'Member',
                phoneNumber: '1234567890',
                email: 'new@example.com',
                role: Role.USER,
            };
            const result = await service.create(createTeamMemberDto);
            expect(result).toEqual(mockTeamMember);
        });

        it('should throw a BadRequestException if validation fails', async () => {
            jest.spyOn(model, 'create').mockRejectedValueOnce({ name: 'ValidationError', errors: {} });
            const createTeamMemberDto: CreateTeamMemberDto = {
                firstName: 'Invalid',
                lastName: 'Member',
                phoneNumber: '123',
                email: 'invalid',
                role: Role.USER,
            };
            await expect(service.create(createTeamMemberDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw a BadRequestException if team member already exists', async () => {
            jest.spyOn(model, 'create').mockRejectedValueOnce({ code: 11000 });
            const createTeamMemberDto: CreateTeamMemberDto = {
                firstName: 'Existing',
                lastName: 'Member',
                phoneNumber: '1234567890',
                email: 'existing@example.com',
                role: Role.USER,
            };
            await expect(service.create(createTeamMemberDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return a paginated list of team members', async () => {
            const teamMembers = [mockTeamMember];
            jest.spyOn(model, 'find').mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValueOnce(teamMembers),
            } as any);
            jest.spyOn(model, 'countDocuments').mockResolvedValueOnce(1);
            const result = await service.findAll(1, 10);
            expect(result).toEqual({ data: teamMembers, total: 1, page: 1, limit: 10 });
        });
    });

    describe('update', () => {
        it('should update a team member', async () => {
            const updateTeamMemberDto: UpdateTeamMemberDto = {
                firstName: 'first',
                lastName: 'last',
                role: Role.USER,
            };
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(mockTeamMember);
            const result = await service.update('mockId', updateTeamMemberDto);
            expect(result).toEqual(mockTeamMember);
        });

        it('should throw a NotFoundException if team member is not found', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(null);
            const updateTeamMemberDto: UpdateTeamMemberDto = {
                firstName: 'Non-existent',
                lastName: 'Member',
                phoneNumber: '0987654321',
                email: 'nonexistent@gmail.com',
                role: Role.USER,
            };
            await expect(service.update('invalidId', updateTeamMemberDto)).rejects.toThrow(NotFoundException);
        });

        it('should throw a BadRequestException if validation fails', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValueOnce({ name: 'ValidationError' });
            const updateTeamMemberDto: UpdateTeamMemberDto = {
                firstName: 'Invalid',
                lastName: 'Member',
                phoneNumber: '123',
                email: 'invalid',
                role: Role.USER,
            };
            await expect(service.update('mockId', updateTeamMemberDto)).rejects.toThrow(BadRequestException);
        });

        it('should throw a BadRequestException if team member already exists', async () => {
            jest.spyOn(model, 'findByIdAndUpdate').mockRejectedValueOnce({ code: 11000 });
            const updateTeamMemberDto: UpdateTeamMemberDto = {
                firstName: 'tst',
                lastName: 'Member',
                phoneNumber: '1234567890',
                email: 'existing@example.com',
                role: Role.USER,
            };
            await expect(service.update('mockId', updateTeamMemberDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should remove a team member', async () => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(mockTeamMember);
            await service.remove('mockId');
        });

        it('should throw a NotFoundException if team member is not found', async () => {
            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValueOnce(null);
            await expect(service.remove('invalidId')).rejects.toThrow(NotFoundException);
        });
    });
});
