import { AsyncStorage } from 'react-native'
import { ApiService } from './apiservice'

export class AuthService {

    static _events = {}

    static checkSession(){

        return new Promise(async (resolve, reject) => {

            ApiService.post('auth/check').then(async (response) => {

                console.log('Auth check session : ', response)

                return resolve(response)

            }).catch((error) => {
                return reject('Sesiunea ta a expirat! Te rugam sa te loghezi!')
            })

        })

    }

    static login(email: string, pass?:any) {

        return new Promise(async (resolve, reject) => {

            ApiService.post('auth/login', { username: email, password: pass }).then(async (user) => {

                console.log('Auth Login server response')
                console.log(user)

                global.user = user

                AuthService.dispatch('change')

                return resolve(user)

            }).catch((error) => {
                reject(error)
            })

        })

    }

    static async logout() {

        try {

            await ApiService.post('auth/logout')

            await ApiService.clearCookies()

            AuthService.dispatch('change')

        } catch (error) {
            console.log('Auth -> Error when logout: %s', error)
        }

    }

    static async dispatch(event){
        if(AuthService._events[event]){
            for(var eventCallback of AuthService._events[event]){
                eventCallback()
            }
        }
    }

    static async on(event, callback){
        if(!AuthService._events[event]){
            AuthService._events[event] = []
        }
        AuthService._events[event].push(callback)
    }

}
