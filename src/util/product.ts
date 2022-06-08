import { BaseModel } from './basemodel'

const images = {
    camasa: require('../../assets/products/camasa.png'),
    vesta: require('../../assets/products/vesta.png'),
    sacou: require('../../assets/products/sacou.png'),
    pantaloni: require('../../assets/products/pantaloni.png'),
    pantofi: require('../../assets/products/pantofi.png')
}

export enum ProductSectionFieldTypes {
    NUMBER = 1,
    TEXT = 2
}

export class Product extends BaseModel {

    static collectionName = 'products'

    static afterFetch(productData){

        productData.image = images[productData.image]

        return productData
    }

    static findAll(forceRefresh: Bool) {
        return BaseModel._findAll(Product, ...arguments)
    }

    static findOne() {
        return BaseModel._findOneBy(Product, '_id', ...arguments)
    }

    static new() {
        return BaseModel._new(Product, ...arguments)
    }

}
