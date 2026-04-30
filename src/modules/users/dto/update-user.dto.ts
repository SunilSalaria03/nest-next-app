import { IsMongoId } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Types } from 'mongoose';

export class UpdateUserDto extends CreateUserDto {
  @IsMongoId()
  _id: Types.ObjectId;
}
