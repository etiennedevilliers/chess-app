import { Router } from "websocket-express";

import * as handlers from '../handlers';

export const router = new Router();

router.post('/', handlers.games.create);
router.get('/all', handlers.games.readAll);
router.ws('/stream', handlers.games.stream);
router.get('/:id', handlers.games.read);
router.get('/:id/moves', handlers.moves.readAllByGame)
router.delete('/:id', handlers.games.softDelete);
router.patch('/:id', handlers.games.update);
