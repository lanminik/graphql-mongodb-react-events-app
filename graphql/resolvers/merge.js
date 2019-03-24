const DataLoader = require('dataloader');

const User = require('../../models/user');
const Event = require('../../models/event');
const { dateToString } = require('../../helpers/date');

const eventLoader = new DataLoader(eventIds => {
  return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const transformEvent = event => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator)
  };
};

const transformBooking = booking => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking.user._id),
    event: singleEvent.bind(this, booking.event._id),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const events = async eventsIds => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });
    events.sort((a, b) => {
      return (
        eventsIds.indexOf(a._id.toString()) -
        eventsIds.indexOf(b._id.toString())
      );
    });
    return events.map(event => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    //const event = await Event.findById(eventId);
    const event = await eventLoader.load(eventId.toString());

    // return transformEvent(event);
    return event;
  } catch (err) {
    throw err;
  }
};

const user = async userId => {
  try {
    // const user = await User.findById(userId);
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      //createdEvents: events.bind(this, user._doc.createdEvents)
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
