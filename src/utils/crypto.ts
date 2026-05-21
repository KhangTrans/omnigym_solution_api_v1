import CryptoJS from 'crypto-js';
import NodeRSA from 'node-rsa';
import dotenv from 'dotenv';

dotenv.config();

const AES_SECRET = process.env.AES_SECRET || 'default_secret';

// AES Encrypt/Decrypt
export const encryptAES = (text: string): string => {
  return CryptoJS.AES.encrypt(text, AES_SECRET).toString();
};

export const decryptAES = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, AES_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// RSA Setup (In real apps, load from files or env)
const rsa = new NodeRSA({ b: 2048 });
// For demo, we generate keys if not in env
const privateKey = process.env.RSA_PRIVATE_KEY || rsa.generateKeyPair().exportKey('private');
const publicKey = process.env.RSA_PUBLIC_KEY || rsa.exportKey('public');

const rsaInstance = new NodeRSA(privateKey);

export const decryptRSA = (encryptedData: string): string => {
  return rsaInstance.decrypt(encryptedData, 'utf8');
};

export const encryptRSA = (text: string): string => {
  const pub = new NodeRSA(publicKey);
  return pub.encrypt(text, 'base64');
};
