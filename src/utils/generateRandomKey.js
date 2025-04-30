import crypto from 'crypto';

export const secretKey = crypto.randomBytes(64).toString('hex');



console.log(`Your secret key is: ${secretKey}`);