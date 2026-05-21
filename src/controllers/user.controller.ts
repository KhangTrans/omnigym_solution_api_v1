import { Request, Response } from 'express';
import { fetchUsers, createNewUser } from '../services/user.service';

export const getUsers = (req: Request, res: Response) => {
  const users = fetchUsers();
  res.json(users);
};

export const createUser = (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }
  const newUser = createNewUser({ name });
  res.status(201).json(newUser);
};
