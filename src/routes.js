import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/Multer';

import UserController from './app/controllers/userController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import OrganizerController from './app/controllers/OrganizerController';
import SubscriptionController from './app/controllers/SubscriptionController';

import authMiddleware from './app/middlewares/Auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);
routes.post('/meetups/:meetupId/subscriptions', SubscriptionController.store);
routes.get('/meetups/subscriptions', SubscriptionController.index);

routes.get('/organizer', OrganizerController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
