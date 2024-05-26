import { Role } from "../schemas/team-member.schema";

export class CreateTeamMemberDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly phoneNumber: string;
    readonly email: string;
    readonly role: Role;
  }
  