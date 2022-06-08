import { BaseModel } from './basemodel'

export class User extends BaseModel {

  static fields = {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' }
  }

  static collectionName = 'users'

  static methods = {
    getFullName: function(){
      return [this.firstName, this.lastName].join(' ')
    }
  }

  static async findAll() {
    return BaseModel._findAll(User, ...arguments)
  }

  static findOne() {
    return BaseModel._findOneBy(User, '_id', ...arguments)
  }

  static new() {
    return BaseModel._new(User, ...arguments)
  }

}

export enum UserRoles {
    CUSTOMER = 1,
    TAILOR = 2,
    ADMIN = 3
}
