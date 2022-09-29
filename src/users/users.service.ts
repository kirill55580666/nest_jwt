import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

interface UserInfo {
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  about?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(id: string) {
    let userInfo = await this.findById(id)
    userInfo = userInfo.toObject()
    delete userInfo.password
    delete userInfo.refreshToken
    //const {password, refreshToken, ...rest} = userInfo
    //Reflect.deleteProperty(userInfo, 'password')
    return {...userInfo}
  }

  async deleteInfo(id: string, deleteList) {
    let user = await this.findById(id)
    deleteList = {...deleteList}
    Object.entries(deleteList)
      .forEach((element) => {
        if(element[1]) {
          const field = element[0]
          user[field] = undefined
        }
      })
    await user.save()
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByUsername(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email })
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
