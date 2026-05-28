import { AppDataSource } from '../config/data-source.js';
import { User } from '../models/user.entity.js';
import { Customer } from '../models/customer.entity.js';
import { UpdateProfileDto, CreateUserDto } from '../dtos/user.dto.js';
import { getCache, setCache, deleteCache } from '../utils/cache.js';

export const fetchUsers = async () => {
  const cacheKey = 'users:all';
  const cachedUsers = await getCache<User[]>(cacheKey);
  
  if (cachedUsers) {
    return cachedUsers;
  }

  const userRepository = AppDataSource.getRepository(User);
  const users = await userRepository.find();
  
  await setCache(cacheKey, users, 300); // Cache for 5 minutes
  return users;
};

export const updateUserProfile = async (userId: number, updateData: UpdateProfileDto) => {
  const userRepository = AppDataSource.getRepository(User);
  const customerRepository = AppDataSource.getRepository(Customer);
  
  const user = await userRepository.findOne({ 
    where: { id: userId },
    relations: { customer: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Update User fields
  if (updateData.full_name) user.full_name = updateData.full_name;
  if (updateData.phone_number) user.phone_number = updateData.phone_number;
  if (updateData.avatar_url) user.avatar_url = updateData.avatar_url;
  if (updateData.dob) user.dob = new Date(updateData.dob);
  if (updateData.height) user.height = Number(updateData.height);
  if (updateData.weight) user.weight = Number(updateData.weight);
  if (updateData.workout_goal) user.workout_goal = updateData.workout_goal;
  if (updateData.medical_history) user.medical_history = updateData.medical_history;
  if (updateData.gender) user.gender = updateData.gender;

  // If user is a customer (role_id = 3), update or create customer record
  if (user.role_id === 3) {
    let customer = user.customer;
    if (!customer) {
      customer = customerRepository.create({ user_id: userId });
    }
    
    if (updateData.dob) customer.dob = new Date(updateData.dob);
    if (updateData.height) customer.height = Number(updateData.height);
    if (updateData.weight) customer.weight = Number(updateData.weight);
    if (updateData.gender) customer.gender = updateData.gender;
    
    await customerRepository.save(customer);
  }

  await userRepository.save(user);
  
  // Re-fetch to get all relations and updated status
  const updatedUser = await userRepository.findOne({
    where: { id: userId },
    relations: { role: true, customer: true }
  });
  
  // Invalidate cache
  await deleteCache('users:all');
  
  return updatedUser;
};

export const createNewUser = (userData: CreateUserDto) => {
  // Logic to save user to database would go here
  return { id: Date.now(), ...userData };
};
