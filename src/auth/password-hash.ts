import bcrypt from 'bcryptjs';
import config from '../config.json';
/** generateHash function generates a bcrypt hash and salt for passedString.
 *  function is used in this program for initial hashing of passwords.
 *  @params passedString : string - String to be hashed
 *  @returns Promise<string>
 */
export function generateHash(passedString: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(passedString, config.auth.saltLength, (error: any, result: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
/** compareHash function generates a hash for passedString and compares it to the hash provided.
 *  function is used in this program to check user inputted paswords and their respective hashes in database.
 *  @params passedString : string - String to check, hash : string - Hash to compare with passedString.
 *  @returns Promise<boolean>
 */
export function compareHash(passedString: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passedString, hash, (error: any, result: any) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}
