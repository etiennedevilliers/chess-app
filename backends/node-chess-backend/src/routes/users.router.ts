import { Router } from "express";

import * as handlers from '../handlers';

export const router = Router();

router.post('/', handlers.users.create);
router.get('/:id', handlers.users.read);