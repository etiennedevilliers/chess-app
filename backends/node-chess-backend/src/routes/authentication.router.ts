import { Router } from "express";
import * as handlers from '../handlers';

export const router = Router();

router.post('/login', handlers.authentication.login);

