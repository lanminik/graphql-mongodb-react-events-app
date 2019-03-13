const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const event = await Event.findById(args.eventId);
      if (!event) {
        throw new Error("User doesn't exists!");
      }

      const booking = new Booking({
        event,
        user: "5c86875d37c978495d1bdcba"
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });

      return event;
    } catch (err) {
      throw err;
    }
  }
};
