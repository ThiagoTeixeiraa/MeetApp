import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    const { title, description, localization, date, user_id } = req.body;

    const meetup = await Meetup.create({
      title,
      description,
      localization,
      date,
      user_id,
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
