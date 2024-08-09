import { Router } from "express";

import * as routes from './routes';

export const appRouter = Router();

appRouter.use('/health', routes.health);
appRouter.use('/users', routes.users);
appRouter.use('/games', routes.games);
appRouter.use('/authentication', routes.authentication);
appRouter.use('/moves', routes.moves);