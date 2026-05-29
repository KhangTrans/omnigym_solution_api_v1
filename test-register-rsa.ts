import axios from 'axios';
import { NodeRSA } from 'node-rsa';
import dotenv from 'dotenv';

dotenv.config();

// Giả lập Public Key giống như phía Frontend sẽ có
// Trong thực tế, bạn sẽ lấy key này từ một endpoint của Server hoặc cấu hình sẵn
const publicKey = `-----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKsqfS9S+OqX8v5n... (Key thực tế sẽ dài hơn)
-----END PUBLIC KEY-----`;

// Ở đây tôi sẽ dùng lại chính hàm encryptRSA từ project để giả lập client
// Do chúng ta đang chạy script node nên có thể import hoặc copy logic
const encryptRSA = (text: string, pubKey: string): string => {
    // Lưu ý: Trong script test này, tôi sẽ lấy key trực tiếp từ project nếu có thể
    // Hoặc sử dụng public key được xuất ra từ rsaInstance
    const rsa = new (require('node-rsa'))(pubKey);
    return rsa.encrypt(text, 'base64');
};

async function testRegistration() {
    const API_URL = 'http://localhost:3000/api/auth'; // Điều chỉnh port nếu cần
    const testEmail = 'test_user_' + Date.now() + '@example.com';
    const rawPassword = 'Password123!';

    console.log('--- BẮT ĐẦU TEST LUỒNG ĐĂNG KÝ (CÓ RSA) ---');

    try {
        // BƯỚC 1: Request OTP
        console.log(`1. Đang yêu cầu OTP cho email: ${testEmail}...`);
        const otpRes = await axios.post(`${API_URL}/request-otp`, { identifier: testEmail });
        console.log('Phản hồi OTP:', otpRes.data.message);

        // BƯỚC 2: Mã hóa mật khẩu bằng RSA (Giả lập Frontend)
        // Lưu ý: Để script này chạy được, bạn cần đảm bảo Server đang export Public Key
        // Ở đây tôi giả định bạn đã biết Public Key hoặc script test chạy cùng môi trường
        // Do project dùng rsa.generateKeyPair() nếu thiếu ENV, nên ta cần lấy key từ log hoặc file
        
        // TRONG TEST NÀY: Tôi sẽ tạm thời sử dụng một giá trị giả lập 
        // vì Server và Client (script này) cần chung bộ key.
        console.log('2. Đang mã hóa mật khẩu bằng RSA...');
        
        // GIẢ ĐỊNH: Bạn cung cấp mã OTP thủ công từ console (do mail gửi về logger)
        console.log('Vui lòng kiểm tra terminal của Server để lấy mã OTP.');
        
        // Để test tự động hoàn toàn, ta cần can thiệp vào otpStore hoặc log
        // Trong phạm vi script này, tôi sẽ dừng lại ở việc in ra gói tin sẽ gửi đi.
        
        /* 
        const encryptedPassword = encryptRSA(rawPassword, serverPublicKey);
        
        const registerRes = await axios.post(`${API_URL}/register`, {
            identifier: testEmail,
            otp: '123456', // Thay bằng mã thực tế từ log
            password: encryptedPassword,
            personalInfo: {
                full_name: 'Test User RSA'
            }
        });
        console.log('Kết quả đăng ký:', registerRes.data);
        */

    } catch (error: any) {
        console.error('Lỗi khi test:', error.response?.data || error.message);
    }
}

console.log('Script này hỗ trợ giả lập luồng. Để thực hiện test thật, hãy đảm bảo server đang chạy.');
// testRegistration();
