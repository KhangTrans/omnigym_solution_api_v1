import { AppDataSource } from "../config/data-source.js";
import { Trainer } from "../models/trainer.entity.js";
import { TrainerCertificate } from "../models/trainer-certificate.entity.js";
import { TrainerPackage } from "../models/trainer-package.entity.js";
import { CertificateStatus } from "../models/trainer-status.enum.js";

/**
 * Public trainer detail.
 * - Chỉ trả về trainer đang active (is_active = true).
 * - Kèm thông tin user (full_name, avatar_url), chi nhánh đang phụ trách,
 *   chứng chỉ đã được duyệt (status = Approved), và các gói tập tương ứng level
 *   của trainer (filter từ TrainerPackage chung).
 * - Nếu trainer chưa có review thì FE sẽ hiển thị "Chưa có đánh giá";
 *   service trả luôn rating/review_count đang lưu trên entity Trainer.
 */
export const getPublicTrainerDetail = async (trainerId: number) => {
  const trainerRepo = AppDataSource.getRepository(Trainer);

  const trainer = await trainerRepo.findOne({
    where: { id: trainerId, is_active: true },
    relations: {
      user: true,
      branch: true,
    },
  });

  if (!trainer) {
    const error = new Error("Không tìm thấy huấn luyện viên.");
    (error as any).status = 404;
    throw error;
  }

  const certificateRepo = AppDataSource.getRepository(TrainerCertificate);
  const certificates = await certificateRepo.find({
    where: {
      trainer_id: trainer.id,
      status: CertificateStatus.Approved,
    },
    order: { issued_at: "DESC", id: "DESC" },
  });

  // Trainer Packages hiện đang là gói chung theo level (junior/senior/master),
  // không gắn riêng theo từng trainer. Lọc theo level của trainer này để hiển thị.
  let packages: TrainerPackage[] = [];
  if (trainer.level) {
    const packageRepo = AppDataSource.getRepository(TrainerPackage);
    packages = await packageRepo.find({
      where: {
        trainer_level: trainer.level,
        is_active: true,
      },
      order: { package_price: "ASC" },
    });
  }

  // Sanitize user (loại bỏ password và data nhạy cảm)
  const safeUser = trainer.user
    ? {
        id: trainer.user.id,
        full_name: trainer.user.full_name,
        avatar_url: trainer.user.avatar_url,
        email: trainer.user.email,
      }
    : null;

  const safeBranch = trainer.branch
    ? {
        id: trainer.branch.id,
        branch_name: trainer.branch.branch_name,
        province: trainer.branch.province,
        district: trainer.branch.district,
        address: trainer.branch.address,
        hotline: trainer.branch.hotline,
        image_url: trainer.branch.image_url,
      }
    : null;

  return {
    id: trainer.id,
    user_id: trainer.user_id,
    full_name: safeUser?.full_name ?? null,
    avatar_url: trainer.avatar_url || safeUser?.avatar_url || null,
    bio: trainer.bio ?? null,
    specialization: trainer.specialization ?? null,
    level: trainer.level ?? null,
    years_experience: trainer.years_experience ?? 0,
    rating: Number(trainer.rating ?? 0),
    review_count: trainer.review_count ?? 0,
    hourly_rate:
      trainer.hourly_rate === undefined || trainer.hourly_rate === null
        ? null
        : Number(trainer.hourly_rate),
    phone_number: trainer.phone_number ?? null,
    address: trainer.address ?? null,
    is_active: trainer.is_active,
    approved_at: trainer.approved_at ?? null,
    branch: safeBranch,
    user: safeUser,
    certificates: certificates.map((cert) => ({
      id: cert.id,
      cert_name: cert.cert_name ?? null,
      issued_by: cert.issued_by ?? null,
      certificate_number: cert.certificate_number ?? null,
      image_url: cert.image_url ?? null,
      issued_at: cert.issued_at ?? null,
      expires_at: cert.expires_at ?? null,
    })),
    packages: packages.map((pkg) => ({
      id: pkg.id,
      package_name: pkg.package_name,
      session_count: pkg.session_count,
      package_price: Number(pkg.package_price),
      price_per_session: Number(pkg.price_per_session),
      trainer_level: pkg.trainer_level,
      mode: pkg.mode,
      description: pkg.description ?? null,
    })),
    // Reviews chưa có entity riêng cho trainer; trả mảng rỗng để FE
    // hiển thị "Chưa có đánh giá" theo đúng convention.
    reviews: [] as Array<{
      id: number;
      author: string;
      rating: number;
      comment: string;
      created_at: string;
    }>,
  };
};
