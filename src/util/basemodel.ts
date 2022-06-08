import Backend from 'react-native-Backend';
import moment from 'moment'

import { ApiService } from './apiservice'

export class BaseModel {

  static dataCache: {}[];
  static collectionName: String;
  static fields: {};
  static debugEnabled = false

  static debug(logType){
    BaseModel.debugEnabled ? logType !== "warn" ? console.log(...arguments) : console.warn(...arguments) : null
  }

  static getModelKey(modelKey){
    if(modelKey._id) return modelKey._id
    return modelKey
  }

  static _getCollectionName(self){
    if (!self.collectionName) {
      throw new Error('No collection name property found for model %s', self.name)
    }

    return self.collectionName
  }

  static async _fieldParse(self, modelData, fieldKey, field){

    var fieldValue = modelData[fieldKey]

    if(typeof fieldValue !== "undefined"){

      if(field.type === 'date'){

        if(modelData && fieldValue){
          modelData[fieldKey] = moment(fieldValue)
        }

      }
      else if(field.type === 'ref'){

        if(field.ref && field.ref.findOne && fieldValue){

          let foundRefModel = await field.ref.findOne(fieldValue)
          if(foundRefModel){
            modelData[fieldKey] = foundRefModel
          }

        }

      }

      return

    }

    if(field && typeof field.default !== "undefined"){
      modelData[fieldKey] = field.default
      return
    }

    if(!field){
      modelData[fieldKey] = null
      return
    }

    if(field.type == 'objectsArray'){
      modelData[fieldKey] = {}
    }
    else if(field.type == 'number'){
      modelData[fieldKey] = 0
    }
    else{
      modelData[fieldKey] = null
    }

  }

  static async singleModelParse(self, modelData) {

    for(var fieldKey in self.fields){

      var field = self.fields[fieldKey]

      if(!field.subfields){
        await BaseModel._fieldParse(self, modelData, fieldKey, field)
      }
      else{

        if(!modelData[fieldKey]){
          modelData[fieldKey] = {}
        }

        for(subfieldKey in field.subfields){
          await BaseModel._fieldParse(self, modelData[fieldKey], subfieldKey, field.subfields[subfieldKey])
        }
      }

    }

    if(self.afterFetch){
      modelData = await self.afterFetch(modelData)
    }

    for(var modelFieldKey in modelData){

      var modelFieldValue = modelData[modelFieldKey]

      var mapMethod = self[modelFieldKey + 'AfterFetch']
      if(mapMethod){
        modelData[modelFieldKey] = await self[modelFieldKey + 'AfterFetch'](modelFieldValue)
      }

    }

    if(self.methods){
      for(methodName in self.methods){
        modelData[methodName] = self.methods[methodName]
      }
    }

    return modelData
  }

  static async modelsParse(self, modelsData) {

    var newModels = []

    for(var modelData of modelsData){
      let processedItem = await BaseModel.singleModelParse(self, modelData)
      newModels.push(processedItem)
    }

    return newModels
  }

  static async _findAll(self, forceRefresh) {

    return new Promise(async (resolve, reject) => {

      if (!forceRefresh) {
        if (!self.disableCache && self.dataCache && self.dataCache.length) {
          BaseModel.debug('FETCH -> CACHE -> %s -> findAll() : Count : %s', self.name, self.dataCache.length)
          return resolve(self.dataCache)
        }
      } else {
        BaseModel.debug('FETCH -> FORCE REFRESH -> %s', self.name)
      }

      ApiService.get(BaseModel._getCollectionName(self)).then(async (response) => {

        let processedData = await BaseModel.modelsParse(self, response)
        if(!self.disableCache){
          self.dataCache = processedData
        }

        BaseModel.debug('FETCH -> Backend -> %s -> findAll() : Count : %s', self.name, processedData.length)

        return resolve(processedData)

      }, (error) => {
        BaseModel.debug("warn", 'FETCH -> Backend -> %s -> findAll() : Error : %s', self.name, error)
        reject(error)
      })

    })

  }

  static async _findAllBy(self, modelKey, modelValue, forceRefresh) {

    return new Promise(async (resolve, reject) => {

      if (!forceRefresh) {
        if (!self.disableCache && self.dataCache && self.dataCache.length) {
          BaseModel.debug('FETCH -> CACHE -> %s -> findAllBy(%s, %s) : Count : %s', self.name, modelKey, modelValue, self.dataCache.length)
          return resolve(self.dataCache.filter(function(order) {
            return order[modelKey] === modelValue
          }))
        }
      } else {
        BaseModel.debug('FETCH -> FORCE REFRESH -> %s', self.name)
      }

      var queryParams = {
        query : {}
      }

      queryParams.query[modelKey] = modelValue

      ApiService.get(BaseModel._getCollectionName(self), queryParams).then(async (response) => {

        let processedData = await BaseModel.modelsParse(self, response)

        BaseModel.debug('FETCH -> FIREBASE -> %s -> findAllBy(%s, %s) : Count : %s', self.name, modelKey, modelValue, processedData.length)

        return resolve(processedData)

      }, (error) => {
        BaseModel.debug("warn", 'FETCH -> FIREBASE -> %s -> findAllBy(%s, %s) : Error : %s', self.name, modelKey, modelValue, error)
        reject(error)
      })

    })

  }

  static async _getModelBy(self, modelKey, modelValue) {

    return new Promise(async (resolve, reject) => {

      if (!self.disableCache && self.dataCache && self.dataCache.length) {

        let filteredItems = self.dataCache.filter(function(item) {
          return item[modelKey] == modelValue;
        });

        if (filteredItems.length) {
          BaseModel.debug('FETCH -> CACHE -> %s -> findBy(%s, %s)', self.name, modelKey, modelValue)
          return resolve(filteredItems[0])
        }

      }

      ApiService.get([BaseModel._getCollectionName(self), modelKey, modelValue].join('/')).then(async (result) => {

        let processedItem = await BaseModel.singleModelParse(self, result)

        BaseModel.debug('FETCH -> Backend -> %s -> findBy(%s, %s)', self.name, modelKey, modelValue)

        if (!self.disableCache){

          if(!self.dataCache){
            self.dataCache = []
          }

          if(!self.dataCache.filter(item => { return item._id == processedItem._id }).length){
            self.dataCache.push(processedItem)
          }

        }

        return resolve(processedItem)

      }).catch((error) => {
        BaseModel.debug('FETCH -> Backend -> %s -> findBy(%s, %s) -> Error or not found : %s', self.name, modelKey, modelValue, error)
        return resolve(null)
      })

    })
  }

  static async _findOneBy(self, modelKey, modelValue) {

    return new Promise(async (resolve, reject) => {

      var cachedResult = BaseModel._getModelBy(self, modelKey, modelValue)

      if(cachedResult){
        return resolve(cachedResult);
      }

      return resolve(BaseModel._getModelBy(self, modelKey, modelValue));

    })

  }

  static async _new(self, modelData, modelId) {

    return new Promise(async (resolve, reject) => {

      BaseModel.debug('NEW_MODEL -> Backend -> %s -> new() : Data : %s', self.name, JSON.stringify(modelData))

      if(self.beforeSave){
        modelData = await self.beforeSave(modelData)
      }

      ApiService.post(BaseModel._getCollectionName(self), modelData).then(async (response) => {

        var savedModel = await BaseModel.singleModelParse(self, response)

        BaseModel.debug('NEW_MODEL -> Backend -> %s -> new() -> Saved', self.name, savedModel)

        if(!self.disableCache){
          self.dataCache.push(savedModel)
          BaseModel.debug('NEW_MODEL -> Backend -> %s -> new() -> Added to the cache', self.name, savedModel)
        }

        return resolve(savedModel)

      }).catch((error) => {
        BaseModel.debug("warn", 'NEW_MODEL -> Backend -> %s -> new() : Error : %s', self.name, error)
        reject(error)
      })

    })
  }

  static async getApi(self, path) {

    return new Promise(async (resolve, reject) => {

      var finalUrl = [BaseModel._getCollectionName(self), path].join('/')

      BaseModel.debug('GET -> Backend -> %s -> GET -> URL : %s', self.name, finalUrl)

      ApiService.get(finalUrl).then(async (response) => {

        return resolve(response)

      }).catch((error) => {
        BaseModel.debug("warn", 'GET -> Backend -> %s -> GET call : Error : %s', self.name, error)
        reject(error)
      })

    })
  }

  static async postApi(self, path, modelData) {

    return new Promise(async (resolve, reject) => {

      var finalUrl = [BaseModel._getCollectionName(self), path].join('/')

      BaseModel.debug('POST -> Backend -> %s -> POST -> URL : %s -> Data : %s', self.name, finalUrl, JSON.stringify(modelData))

      ApiService.post(finalUrl, modelData).then(async (response) => {

        return resolve(response)

      }).catch((error) => {
        BaseModel.debug("warn", 'POST -> Backend -> %s -> POST call : Error : %s', self.name, error)
        reject(error)
      })

    })
  }

  static async deleteApi(self, path) {

    return new Promise(async (resolve, reject) => {

      var finalUrl = [BaseModel._getCollectionName(self), path].join('/')

      BaseModel.debug('DELETE -> Backend -> %s -> DELETE -> URL : %s', self.name, finalUrl)

      ApiService.delete(finalUrl).then(async (response) => {

        return resolve(response)

      }).catch((error) => {
        BaseModel.debug("warn", 'DELETE -> Backend -> %s -> DELETE call : Error : %s', self.name, error)
        reject(error)
      })

    })
  }



}
