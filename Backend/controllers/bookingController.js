import Stripe from "stripe";
import AppError from "../errorHandlers/appError.js";

import Doctor from "../Models/DoctorSchema.js";
import Booking from "../Models/BookingSchema.js";

export const getCheckoutSession = async (req, res) => {
  try {
    //get currently booked doctor
    const doctor = await Doctor.findById(req.params.doctorId);

    // const user = await User.findById(req.user.id);
    if (req.user.id === doctor.id) {
      console.log("NOt allowed");
      return new AppError(
        "You can't book yourself. Please find another doctor",
        400
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // create stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${req.protocol}://${req.get("host")}/doctors/${doctor.id}`,
      customer_email: req.user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            unit_amount: doctor.ticketPrice * 100,
            product_data: {
              name: doctor.name,
              description: doctor.bio,
              images: [doctor.photo],
            },
          },
          quantity: 1,
        },
      ],
    });

    // create new booking
    const booking = new Booking({
      doctor: doctor._id,
      user: req.user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Successfully paid",
      session,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
};
