import { Router } from "websocket-express";

import * as handlers from '../handlers';

export const router = new Router();

router.post('/', handlers.moves.create);
router.get('/:id', handlers.moves.read);
router.delete('/:id', handlers.moves.softDelete);
router.patch('/:id', handlers.moves.update);