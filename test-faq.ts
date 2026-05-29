import { AppDataSource } from './src/config/data-source.js';
import { FAQ } from './src/models/faq.entity.js';
import { User } from './src/models/user.entity.js';
import { fetchFaqs } from './src/services/faq.service.js';

async function testFAQ() {
  try {
    await AppDataSource.initialize();
    console.log('--- 🧪 ĐANG KIỂM TRA CHỨC NĂNG FAQ ---');

    const faqRepo = AppDataSource.getRepository(FAQ);
    const userRepo = AppDataSource.getRepository(User);

    // 1. Tìm user Admin để làm creator
    const admin = await userRepo.findOne({ where: { email: 'admin@omnigym.com' } });
    if (!admin) {
      console.log('❌ Cảnh báo: Không tìm thấy admin@omnigym.com. Vui lòng chạy seed trước.');
      process.exit(1);
    }

    // 2. Tạo dữ liệu mẫu nếu chưa có
    const count = await faqRepo.count();
    if (count === 0) {
      console.log('\n📝 Đang tạo dữ liệu FAQ mẫu...');
      await faqRepo.save([
        {
          title: 'Làm thế nào để đăng ký hội viên?',
          content: 'Bạn có thể đăng ký trực tiếp trên ứng dụng hoặc đến phòng gym gần nhất.',
          category: 'General',
          created_by: admin.id,
          is_published: true,
          published_at: new Date()
        },
        {
          title: 'Chính sách hoàn tiền như thế nào?',
          content: 'Chúng tôi hỗ trợ hoàn tiền trong vòng 3 ngày kể từ khi kích hoạt gói tập.',
          category: 'Policy',
          created_by: admin.id,
          is_published: false
        }
      ]);
      console.log('✅ Đã tạo FAQ mẫu thành công.');
    }

    // 3. Test lấy toàn bộ FAQ (Fetch all)
    console.log('\n[1] Thử nghiệm lấy toàn bộ FAQ...');
    const allFaqs = await fetchFaqs({});
    console.log(`✅ Tìm thấy ${allFaqs.length} FAQs.`);
    allFaqs.forEach(f => {
      console.log(` - [${f.category}] ${f.title} (Published: ${f.is_published}) - Bởi: ${f.creator?.full_name}`);
    });

    // 4. Test lọc theo category
    console.log('\n[2] Thử nghiệm lọc FAQ theo category: General...');
    const generalFaqs = await fetchFaqs({ category: 'General' });
    console.log(`✅ Tìm thấy ${generalFaqs.length} FAQs thuộc category General.`);

    // 5. Test lọc theo status
    console.log('\n[3] Thử nghiệm lọc FAQ theo trạng thái: Đã xuất bản...');
    const publishedFaqs = await fetchFaqs({ is_published: true });
    console.log(`✅ Tìm thấy ${publishedFaqs.length} FAQs đã xuất bản.`);

    console.log('\n--- ✨ CHỨC NĂNG FAQ HOẠT ĐỘNG TỐT ---');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi test FAQ:', error);
    process.exit(1);
  }
}

testFAQ();
