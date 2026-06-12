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
const rawPrivateKey = process.env.RSA_PRIVATE_KEY;

// Xử lý ký tự xuống dòng từ file .env nếu có
const cleanPrivateKey = rawPrivateKey 
  ? rawPrivateKey.replace(/\\n/g, '\n').trim().replace(/^"|"$/g, '') 
  : null;

// Khởi tạo instance với cấu hình mặc định tương thích cao
const rsaInstance = new NodeRSA();

if (cleanPrivateKey) {
  try {
    // Import Private Key
    rsaInstance.importKey(cleanPrivateKey, 'private');
  } catch (err) {
    console.warn('RSA Private Key invalid, generating new key...');
    rsaInstance.generateKeyPair(2048);
  }
} else {
  rsaInstance.generateKeyPair(2048);
}

// Quan trọng: Sử dụng pkcs1 padding (mặc định của JSEncrypt)
rsaInstance.setOptions({ encryptionScheme: 'pkcs1' });

export const getPublicKey = (): string => {
  // Xuất ra PKCS#8 PEM - chuẩn mà JSEncrypt hỗ trợ tốt nhất nếu key sạch
  return rsaInstance.exportKey('pkcs8-public-pem');
};

export const decryptRSA = (encryptedData: string): string => {
  try {
    if (!encryptedData) throw new Error('Data to decrypt is empty');
    // node-rsa giải mã chuỗi base64 mặc định nếu encryptionScheme đã set
    return rsaInstance.decrypt(encryptedData, 'utf8');
  } catch (error: any) {
    console.error('RSA Decryption Error Details:', error.message);
    throw error;
  }
};

export const encryptRSA = (text: string): string => {
  return rsaInstance.encrypt(text, 'base64');
};

export const encryptTokenRSA = (payload: any): string => {
  try {
    // Để tránh vượt quá giới hạn RSA-2048 (tối đa 245 bytes dữ liệu thô với PKCS#1 padding),
    // chúng ta sẽ kiểm tra độ dài chuỗi và rút gọn các trường không quan trọng nếu cần.
    let targetPayload = { ...payload };
    let jsonStr = JSON.stringify(targetPayload);

    if (jsonStr.length > 240 && targetPayload.avatar_url) {
      delete targetPayload.avatar_url;
      jsonStr = JSON.stringify(targetPayload);
    }

    if (jsonStr.length > 240) {
      // Chỉ giữ lại các trường tối thiểu bắt buộc cho việc phân quyền và định danh
      targetPayload = {
        id: targetPayload.id,
        role: targetPayload.role,
        email: targetPayload.email
      };
      jsonStr = JSON.stringify(targetPayload);
    }

    if (jsonStr.length > 240) {
      // Mức tối thiểu nhất
      targetPayload = {
        id: targetPayload.id,
        role: targetPayload.role
      };
      jsonStr = JSON.stringify(targetPayload);
    }

    return encryptRSA(jsonStr);
  } catch (error: any) {
    console.error('Failed to encrypt token with RSA:', error.message);
    throw new Error('Token generation failed');
  }
};

export const decryptTokenRSA = (token: string): any => {
  try {
    const decryptedStr = decryptRSA(token);
    return JSON.parse(decryptedStr);
  } catch (error: any) {
    console.error('Failed to decrypt token with RSA:', error.message);
    throw new Error('Invalid or expired token');
  }
};

