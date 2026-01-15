import { Router, Request, Response } from 'express';
import { userService } from '../services';
import { CreateUserDTO, UpdateUserDTO } from '../models';

const router = Router();

// Get all users
router.get('/', (_req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create new user
router.post('/', (req: Request, res: Response) => {
  try {
    const dto: CreateUserDTO = req.body;

    if (!dto.email || !dto.firstName || !dto.lastName) {
      return res.status(400).json({ error: 'Email, firstName, and lastName are required' });
    }

    const user = userService.createUser(dto);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', (req: Request, res: Response) => {
  try {
    const dto: UpdateUserDTO = req.body;
    const user = userService.updateUser(req.params.id, dto);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const deleted = userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
