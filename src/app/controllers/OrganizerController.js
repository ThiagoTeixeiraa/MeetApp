import { Router } from 'express';
import Meetup from '../models/Meetup';
import authMiddleware from '../middlewares/Auth';

class OrganizerController {
  constructor() {
    this.routes = Router();

    this.routes.get('/organizing', authMiddleware, this.index);
  }

  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
    });
    return res.json(meetups);
  }
}

export default new OrganizerController().routes;
