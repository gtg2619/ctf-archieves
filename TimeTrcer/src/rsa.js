const crypto = require('crypto');
const fs = require('fs');


const creatPairKey = function(){
   return crypto.generateKeyPairSync('rsa', {
   modulusLength: 2048,
   publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
   },
   privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
   }
});}

const savePairKey = function(hash){
   const {publicKey, privateKey} =creatPairKey()
   fs.writeFileSync(`${__dirname}/public_key/${hash}.public.pem`, publicKey)
   return privateKey
}


const verifyPairKey = function(hash, privateKey){

   const publicKey = fs.readFileSync(`${__dirname}/public_key/${hash}.public.pem`, 'utf-8');

   // Data to be signed
   const data = crypto.randomBytes(128).toString('hex');

   // Sign the data with the private key
   const sign = crypto.createSign('RSA-SHA256');
   sign.update(data);
   const signature = sign.sign(privateKey, 'hex');

   // Use a public key to verify the signature
   const verify = crypto.createVerify('RSA-SHA256');
   verify.update(data);

   // Verify that the returned result
   const isValid = verify.verify(publicKey, signature, 'hex');
   return isValid
}

module.exports = {savePairKey, 
                  verifyPairKey}
