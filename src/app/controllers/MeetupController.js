import * as Yup from 'yup';
import { Router } from 'express';
import { Op } from 'sequelize';
import { isBefore, startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import authMiddleware from '../middlewares/Auth';

class MeetupController {
  constructor() {
    this.routes = Router();

    this.routes.get('/meetups', authMiddleware, this.index);
    this.routes.post('/meetups', authMiddleware, this.store);
    this.routes.put('/meetups/:id', authMiddleware, this.update);
    this.routes.delete('/meetups/:id', authMiddleware, this.delete);
  }

  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [User],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const parsedDate = parseISO(req.body.date);

    if (isBefore(parsedDate, new Date())) {
      return res
        .status(400)
        .json({ error: 'creating a past date meetup is not allowed' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      localization: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const user_id = req.userId;

    const meetup = await Meetup.findByPk(req.params.id);

    if (meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'only organizers can edit.' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'update a past date meetup is not allowed' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findOne({ where: { id: req.params.id } });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'You can only cancel meetups organized by you' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: "you can't cancel meetups that already happened" });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController().routes;
