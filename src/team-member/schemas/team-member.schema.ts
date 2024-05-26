import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type TeamMemberDocument = TeamMember & Document;
export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}
@Schema({
    timestamps: true
})

export class TeamMember {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    phoneNumber: string;

    @Prop({
        required: true,
        unique: true,
        validate: {
          validator: function (v: string) {
            return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
          },
          message: (props) => `${props.value} is not a valid email address!`,
        },
      })
      email: string;

    @Prop({ required: true })
    role: Role;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember)