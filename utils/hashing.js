import crypto from 'crypto';
import  bcryptjs from 'bcryptjs';


export const doHash = (value, saltValue)=>{
const result = bcryptjs.hash(value, saltValue);
return result
}

export const doHashValidation = (value, hashedValue)=>{
 const result = bcryptjs.compare(value, hashedValue);
 return result;
};

export const hmacProcess = (value, key)=>{
    const result2 = crypto.createHmac('sha256', key).update(value).digest('hex');
    const result = crypto.createHmac('sha256', key).update(value).digest('base64');

    return result;
}



export default {
    doHash,
    doHashValidation,
    hmacProcess
}


