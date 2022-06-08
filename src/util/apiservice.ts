import { AsyncStorage } from 'react-native'
import CookieManager from 'react-native-cookies'

export class ApiService {

    private static productionApiUrl : string = 'https://sizex-production.herokuapp.com/'
    private static devApiUrl : string = 'http://localhost:8888/'

    static serialize(obj, prefix) {
      var str = [],
        p;
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + "[" + p + "]" : p,
            v = obj[p];
          str.push((v !== null && typeof v === "object") ?
            ApiService.serialize(v, k) :
            encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
      }
      return str.join("&");
    }

    static getUrl(url: string){
        if (__DEV__) {
            return ApiService.devApiUrl + url
        }
        return ApiService.productionApiUrl + url
    }

    static async doRequest(url:string, method:string, body:object){

        return new Promise(async (resolve:any, reject:any) => {

            var cookies = null
            try {
                cookies = await AsyncStorage.getItem('@SizeX:apiCookies');
            } catch (error) {
                console.log('Error getting cookies: %s', error)
            }

            if(!cookies){
                console.log('API request -> No cookies stored')
            }

            var params:any = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            }

            if(body && method !== "GET"){
                params.body = JSON.stringify(body)
            }

            if(cookies){
                params.headers.cookie = cookies
            }

            console.log('API request -> Start : %s -> %s -----> ', method, ApiService.getUrl(url), params)

            return CookieManager.clearAll().then(() => {

                fetch(ApiService.getUrl(url), params)
                    .then((response) => {

                        var gotCookies = response.headers.get("set-cookie")
                        if(gotCookies){
                            try {
                                AsyncStorage.setItem('@SizeX:apiCookies', gotCookies);
                            }
                            catch (error) {
                                console.log('API request -> Get cookies error : ', error)
                            }
                        }

                        return response.json()

                    })
                    .then((result) => {

                        console.log("API request -> Done : ", result)

                        if (result.success) {
                            resolve(result.data)
                        }
                        else{
                            reject({message: result.error, code: result.errorCode})
                        }

                    })
                    .catch(error => {
                        console.log('API request -> Error : ', error)
                        reject(error)
                    })
            })

        })

    }

    static get(url: string, data?:any) {

        if(data){
            url += ['?', ApiService.serialize(data)].join('')
        }

        return ApiService.doRequest(url, 'GET')
    }

    static post(url: string, data) {
        return ApiService.doRequest(url, 'POST', data)
    }

    static put(url: string, data) {
        return ApiService.doRequest(url, 'PUT', data)
    }

    static delete(url: string) {
        return ApiService.doRequest(url, 'DELETE')
    }

    static clearCookies(){
        return new Promise(async (resolve, reject) => {

            try {
                AsyncStorage.removeItem('@SizeX:apiCookies');
                resolve()
            }
            catch (error) {
                console.log('API request -> Remove cookies error : ', error)
                reject('API request -> Remove cookies error : ' + error)
            }

        })
    }

}
