import { AppDataSource } from '../config/data-source.js';
import { Branch } from '../models/branch.entity.js';
import { BranchImage } from '../models/branch-image.entity.js';
import { BranchFacility } from '../models/branch-facility.entity.js';
import { BranchFacilityImage } from '../models/branch-facility-image.entity.js';
import { CreateBranchDto } from '../dtos/branch.dto.js';

export const createBranch = async (data: CreateBranchDto) => {
  return await AppDataSource.transaction(async (transactionalEntityManager) => {
    // 1. Create Branch
    const branchRepo = transactionalEntityManager.getRepository(Branch);
    const newBranch = branchRepo.create({
      partner_id: data.partner_id,
      branch_name: data.branch_name,
      address: data.address,
      hotline: data.hotline,
      status: 'active',
      province: data.province,
      district: data.district,
      opening_house: data.opening_house,
      image_url: data.image_url
    });
    
    const savedBranch = await transactionalEntityManager.save(newBranch);

    // 2. Save Branch Images if any
    if (data.images && data.images.length > 0) {
      const imageRepo = transactionalEntityManager.getRepository(BranchImage);
      const branchImages = data.images.map(img => imageRepo.create({
        branch_id: savedBranch.id,
        image_url: img.image_url,
        is_cover: img.is_cover || false,
        sort_order: img.sort_order || 0
      }));
      await transactionalEntityManager.save(branchImages);
    }

    // 3. Save Branch Facilities if any
    if (data.facilities && data.facilities.length > 0) {
      const facilityRepo = transactionalEntityManager.getRepository(BranchFacility);
      const facilityImageRepo = transactionalEntityManager.getRepository(BranchFacilityImage);
      
      for (const facData of data.facilities) {
        const newFacility = facilityRepo.create({
          branch_id: savedBranch.id,
          facility_name: facData.facility_name,
          description: facData.description,
          icon_url: facData.icon_url
        });
        const savedFacility = await transactionalEntityManager.save(newFacility);

        if (facData.images && facData.images.length > 0) {
          const facImages = facData.images.map(img => facilityImageRepo.create({
            facility_id: savedFacility.id,
            image_url: img.image_url,
            is_cover: img.is_cover || false,
            sort_order: img.sort_order || 0
          }));
          await transactionalEntityManager.save(facImages);
        }
      }
    }

    // Return the branch with its relations
    return await transactionalEntityManager.findOne(Branch, {
      where: { id: savedBranch.id }
      // You can add relations here if needed for the response
    });
  });
};

export const getAllBranches = async (partnerId?: number) => {
  const branchRepo = AppDataSource.getRepository(Branch);
  return await branchRepo.find({
    where: partnerId ? { partner_id: partnerId } : {},
    order: { id: 'DESC' }
  });
};

export const getBranchById = async (branchId: number) => {
  const branchRepo = AppDataSource.getRepository(Branch);
  const branch = await branchRepo.findOne({
    where: { id: branchId }
  });

  if (!branch) {
    throw new Error('Branch not found');
  }

  const imageRepo = AppDataSource.getRepository(BranchImage);
  const facilityRepo = AppDataSource.getRepository(BranchFacility);

  const [images, facilities] = await Promise.all([
    imageRepo.find({ where: { branch_id: branchId }, order: { sort_order: 'ASC' } }),
    facilityRepo.find({ where: { branch_id: branchId } })
  ]);

  const facilityImageRepo = AppDataSource.getRepository(BranchFacilityImage);
  const facilitiesWithImages = await Promise.all(
    facilities.map(async (fac) => {
      const facImages = await facilityImageRepo.find({
        where: { facility_id: fac.id },
        order: { sort_order: 'ASC' }
      });
      return {
        ...fac,
        images: facImages
      };
    })
  );

  return {
    ...branch,
    images,
    facilities: facilitiesWithImages
  };
};

export const updateBranch = async (branchId: number, data: Partial<CreateBranchDto>) => {
  return await AppDataSource.transaction(async (transactionalEntityManager) => {
    const branchRepo = transactionalEntityManager.getRepository(Branch);
    const branch = await branchRepo.findOne({
      where: { id: branchId }
    });

    if (!branch) {
      throw new Error('Branch not found');
    }

    // Update branch fields
    if (data.branch_name) branch.branch_name = data.branch_name;
    if (data.address) branch.address = data.address;
    if (data.hotline) branch.hotline = data.hotline;
    if (data.province) branch.province = data.province;
    if (data.district) branch.district = data.district;
    if (data.opening_house) branch.opening_house = data.opening_house;
    if (data.image_url) branch.image_url = data.image_url;

    const updatedBranch = await transactionalEntityManager.save(branch);

    // Update images if provided
    if (data.images && data.images.length > 0) {
      const imageRepo = transactionalEntityManager.getRepository(BranchImage);
      // Delete old images
      await imageRepo.delete({ branch_id: branchId });

      const branchImages = data.images.map(img => imageRepo.create({
        branch_id: branchId,
        image_url: img.image_url,
        is_cover: img.is_cover || false,
        sort_order: img.sort_order || 0
      }));
      await transactionalEntityManager.save(branchImages);
    }

    // Update facilities if provided
    if (data.facilities && data.facilities.length > 0) {
      const facilityRepo = transactionalEntityManager.getRepository(BranchFacility);
      const facilityImageRepo = transactionalEntityManager.getRepository(BranchFacilityImage);

      // Delete old facility images and facilities
      const oldFacilities = await facilityRepo.find({ where: { branch_id: branchId } });
      for (const oldFac of oldFacilities) {
        await facilityImageRepo.delete({ facility_id: oldFac.id });
      }
      await facilityRepo.delete({ branch_id: branchId });

      for (const facData of data.facilities) {
        const newFacility = facilityRepo.create({
          branch_id: branchId,
          facility_name: facData.facility_name,
          description: facData.description,
          icon_url: facData.icon_url
        });
        const savedFacility = await transactionalEntityManager.save(newFacility);

        if (facData.images && facData.images.length > 0) {
          const facImages = facData.images.map(img => facilityImageRepo.create({
            facility_id: savedFacility.id,
            image_url: img.image_url,
            is_cover: img.is_cover || false,
            sort_order: img.sort_order || 0
          }));
          await transactionalEntityManager.save(facImages);
        }
      }
    }

    return updatedBranch;
  });
};
