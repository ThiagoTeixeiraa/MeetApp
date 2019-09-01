import { Router } from 'express';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import OrganizerController from './app/controllers/OrganizerController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();

routes.use('/', UserController);
routes.use('/', SessionController);
routes.use('/', MeetupController);
routes.use('/', SubscriptionController);
routes.use('/', OrganizerController);
routes.use('/', FileController);

export default routes;
