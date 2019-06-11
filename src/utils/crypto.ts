import crypto from 'crypto';

const algorithm = 'aes-128-ecb', password = '841787bfaafaadbd94654d3b69d2420f';

export function encrypt(text:string ,pwd?:string){
    if(text)
        text += "";
    
    try{
        var cipher = crypto.createCipheriv(algorithm,Buffer.from(pwd || password, 'hex'), Buffer.from(''));
        var encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    catch(e){
        return false;
    }
}

export function decrypt(text:string,pwd?:string){
    try{
        var decipher = crypto.createDecipheriv(algorithm,Buffer.from(pwd || password, 'hex'), Buffer.from(''));
        var decrypted = decipher.update(text,'hex','utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch(e){
        return false;
    }
}