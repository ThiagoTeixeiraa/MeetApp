import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      order: [[Meetup, 'date']],
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const meetup = await Meetup.findOne({
      where: {
        id: req.params.meetupId,
      },
      include: [User],
    });

    if (meetup.user_id === req.userId) {
      res.status(400).json({ error: 'Organizer cannot subscript for meetup' });
    }

    if (meetup.past) {
      return res.status(400).json({
        error: "you can't subscript for meetups that already happened",
      });
    }

    const isSubscribed = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      },
    });

    if (isSubscribed) {
      return res.status(400).json({
        error: 'You already subscribed to this meetup',
      });
    }

    const checkDate = await Subscription.findOne({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: "Can't subscribe to two meetups at the same time" });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    const user = await User.findOne({ where: { id: req.userId } });

    await Queue.add(SubscriptionMail.key, {
      meetup,
      user,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
