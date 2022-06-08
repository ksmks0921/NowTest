import moment from 'moment'
import { BaseModel } from './basemodel'
import { Utils } from './utils'

export enum StaffRoles {
    TAILOR = 1,
    CUSTOMERCARE = 2
}

export class Staff extends BaseModel {

  static collectionName = 'staff'

  static fields = {
    ordersCount: { type: 'number', default: 0 },
    rating: { type: 'number', default: 0 },
    type: { type: 'string' },
    available: { type: 'boolean', default: true },
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' }
  }

  static methods = {
    getFullName: function(){
      return [this.firstName, this.lastName].join(' ')
    }
  }

  static async findAll(type: String, forceRefresh: Bool) {
    return BaseModel._findAll(Staff, ...arguments)
  }

  static async findAllTailors(){
    return BaseModel._findAllBy(Staff, "type", StaffRoles.TAILOR)
  }

  static async findAllCustomerCare(){
    return BaseModel._findAllBy(Staff, "type", StaffRoles.CUSTOMERCARE)
  }

  static findOne() {
    return BaseModel._findOneBy(Staff, '_id', ...arguments)
  }

  static new() {
    return BaseModel._new(Staff, ...arguments)
  }

}
