import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/user.entity.js';
import { Role } from '../models/role.entity.js';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'omnigym_db',
  synchronize: true, // Set to false in production
  logging: false,
  entities: [User, Role],
  migrations: [],
  subscribers: [],
});
