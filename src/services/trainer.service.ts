import { AppDataSource } from "../config/data-source.js";
import { Trainer } from "../models/trainer.entity.js";
import { Branch } from "../models/branch.entity.js";
import { Staff } from "../models/staff.entity.js";
import { User } from "../models/user.entity.js";

export const getApprovedTrainers = async (currentUser: any) => {
  const trainerRepo = AppDataSource.getRepository(Trainer);
  const role = String(currentUser.role).toLowerCase();

  // Create query builder
  const qb = trainerRepo.createQueryBuilder("trainer")
    .leftJoinAndSelect("trainer.user", "user")
    .leftJoinAndSelect("trainer.branch", "branch")
    .where("trainer.is_active = :isActive", { isActive: true });

  if (role === "admin") {
    // Admin sees all active trainers
  } else if (role === "branchmanager") {
    // BranchManager sees active trainers in their managed branches
    const branchRepository = AppDataSource.getRepository(Branch);
    const managedBranches = await branchRepository.find({
      where: { manager_id: currentUser.id }
    });
    const managedBranchIds = managedBranches.map(b => b.id);

    if (managedBranchIds.length === 0) {
      return [];
    }

    qb.andWhere("trainer.branch_id IN (:...branchIds)", { branchIds: managedBranchIds });
  } else if (role === "staff") {
    // Staff sees active trainers in their assigned branch
    const staffRepository = AppDataSource.getRepository(Staff);
    const staff = await staffRepository.findOne({
      where: { user_id: currentUser.id }
    });

    if (!staff || !staff.branch_id) {
      throw new Error("Tài khoản nhân viên chưa được gán chi nhánh.");
    }

    qb.andWhere("trainer.branch_id = :branchId", { branchId: staff.branch_id });
  } else {
    throw new Error("Bạn không có quyền truy cập chức năng này.");
  }

  const trainers = await qb.getMany();

  // Remove passwords for security
  return trainers.map(t => {
    if (t.user) {
      delete t.user.password;
    }
    return t;
  });
};

export const updateTrainerStatus = async (
  trainerId: number,
  status: string,
  currentUser: any,
) => {
  const role = String(currentUser.role).toLowerCase();
  const trainerRepo = AppDataSource.getRepository(Trainer);
  const userRepo = AppDataSource.getRepository(User);
  const branchRepo = AppDataSource.getRepository(Branch);

  const trainer = await trainerRepo.findOne({
    where: { id: trainerId },
    relations: { user: true, branch: true },
  });

  if (!trainer) {
    throw new Error("Không tìm thấy huấn luyện viên.");
  }

  if (!trainer.user) {
    throw new Error("Huấn luyện viên chưa có tài khoản người dùng.");
  }

  // BranchManager chỉ thao tác trong chi nhánh mình quản lý
  if (role === "branchmanager") {
    const managedBranches = await branchRepo.find({
      where: { manager_id: currentUser.id },
    });
    const managedBranchIds = managedBranches.map((b) => b.id);

    if (
      !trainer.branch_id ||
      !managedBranchIds.includes(trainer.branch_id)
    ) {
      throw new Error("HLV này không thuộc chi nhánh bạn quản lý.");
    }
  }

  trainer.user.status = status;
  await userRepo.save(trainer.user);

  if (trainer.user) {
    delete trainer.user.password;
  }

  return trainer;
};
