import bcrypt, { compare, genSaltSync, hashSync } from 'bcrypt';

const salter = 10;

export const hashed = (password) =>{
    const saltedValue = genSaltSync(salter);
    const hash = hashSync(password, salter);
    return hash;
}

export const compared = (plain, hash)=>{
    return compare(plain, hash)
}