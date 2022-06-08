/**
 * @flow
 *
 * This file handles validation of our form fields
 */
import isEmail from 'validator/lib/isEmail'
import isEmpty from 'validator/lib/isEmpty'

/**
 * Checks if an email is valid:
 * 1) It cannot be empty
 * 2) It must be a valid email format
 */
function isEmailValid(email: string){
    return !!email && isEmail(email) ? undefined : 'Required'
}

/**
 * Checks if a name is valid:
 * 1) It cannot be empty
 */
function isNameValid(name: string){
    return !!name && !isEmpty(name) ? undefined : 'Required'
}

/**
 * Checks if a password is valid:
 * 1) It cannot be empty
 */
// TODO: Proper password validation
function isPasswordValid(password: string){
    return !!password && !isEmpty(password) ? undefined : 'Required'
}

/**
 * Checks if a phone number is valid:
 * 1) It cannot be empty
 */
// TODO: Proper phone number validation
function isPhoneNumberValid(phoneNumber: string){
    return !!phoneNumber && !isEmpty(phoneNumber) ? undefined : 'Required'
}

export { isEmailValid, isNameValid, isPasswordValid, isPhoneNumberValid }
