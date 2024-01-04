// Import necessary models and libraries

import Appointment from "../models/appointmentModel.js";
import Stripe from "stripe";

// Initialize the Stripe API with your secret key

const stripe = new Stripe("sk_test_51ND1JlJ9NW9xyMfcpp7J8fal1DcnxedKjILdfPx5zLTt6Xxa9T5pvcaf43B5RDq5N1LOe6R3aPg8oVE9HUmfZkjU00s6wLr0lT");

// Function to create a payment intent

const createPaymentIntent = async ({ amount, currency }) => {
  const paymentIntent = await stripe.paymentIntents.create({amount: Math.round(amount * 100),currency,});
  return {client_secret: paymentIntent.client_secret,amount: paymentIntent.amount / 100,};
};

// Function to format a date

const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return formattedDate;
};

// Function to create an appointment

const createAppointment = async (req, res) => {
  const { price, day, startTime, endTime, doctorId, date } = req.body.payload;

  // Get the patient's ID from the request

  const patient = req.user.id;

  // Format the date

  const formattedDate = formatDate(date);

  try {

    // Check if there's an existing appointment for the specified time slot

    const existingAppointment = await Appointment.findOne({
      doctorId,
      day,
      date: formattedDate,
      startTime: { $lte: endTime },
      endTime: { $gte: startTime },
      status: "paid",
      appointmentStatus: "pending",
    });

    if (existingAppointment) {return res.status(400).json({ message: "This time slot is already booked" });}

    // Create a payment intent

    const paymentIntent = await createPaymentIntent({amount: price,currency: "PKR",});

    // Define appointment data

    const items = {price,day,startTime,endTime,doctorId,date: formattedDate, patient,};

    // Create a new appointment with the payment intent's client secret

    const appointment = await Appointment.create({...items,clientSecret: paymentIntent.client_secret,});

    // Respond with the created appointment and its client secret

    res.status(201).json({ appointment, clientSecret: appointment.clientSecret });
  } catch (error) {
    res.status(500).json({ message: "Could not create appointment.", error: error.message });
  }
};

// Function to update an appointment's payment status

const updateAppointment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Find the appointment by ID, populating patient and doctor names

    const appointment = await Appointment.findById(req.params.id).populate("patient", "name").populate("doctorId", "name");
    if (!appointment) {return res .status(404) .json({ success: false, error: "Appointment not found" });
    }

    // Update the payment status and payment intent ID

    appointment.paymentIntentId = paymentIntentId;
    appointment.status = "paid";
    await appointment.save();

    // Create a populated appointment object with patient and doctor names

    const populatedAppointment = {
      ...appointment._doc,
      patientName: appointment.patient ? appointment.patient.name : "N/A",
      doctorName: appointment.doctorId ? appointment.doctorId.name : "N/A",
    };
    return res.status(200).json({ success: true, data: populatedAppointment });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Function to get all appointments

const getAllAppointment = async (req, res) => {
  try {
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toISOString();

    // Update the status of completed appointments

    await Appointment.updateMany(
      {
        $and: [
          { date: { $lte: formattedCurrentTime } },
          { endTime: { $lte: currentTime.toTimeString() } },
        ],
        appointmentStatus: "pending",
      },
      { $set: { appointmentStatus: "completed" } }
    );

    // Find all paid appointments and populate patient and doctor names

    const appointments = await Appointment.find({ status: "paid" }).populate("patient", "name").populate("doctorId", "name");

    // Create an array of populated appointment objects

    const populatedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      patientName: appointment.patient ? appointment.patient.name : "N/A",
      doctorName: appointment.doctorId ? appointment.doctorId.name : "N/A",
    }));

    res.status(200).json({ success: true, message: "Appointments found", data: populatedAppointments});
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed To retrieve appointments!", data: error.message});
  }
};

// Function to get appointments for a specific doctor

const getDoctorAppointment = async (req, res) => {
  const doctorId = req.params.id;

  try {
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toISOString();

    // Update the status of completed appointments for the doctor

    await Appointment.updateMany(
      {
        doctorId,
        $and: [
          { date: { $lte: formattedCurrentTime } },
          { endTime: { $lte: currentTime.toTimeString() } },
        ],
        appointmentStatus: "pending",
      },
      { $set: { appointmentStatus: "completed" } }
    );

    // Find all paid appointments for the doctor and populate patient and doctor names

    const appointments = await Appointment.find({ doctorId, status: "paid" }).populate("patient", "name").populate("doctorId", "name");

    // Create an array of populated appointment objects

    const populatedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      patientName: appointment.patient ? appointment.patient.name : "N/A",
      doctorName: appointment.doctorId ? appointment.doctorId.name : "N/A",
    }));

    res.status(200).json({success: true, message: "Doctor's appointments found", data: populatedAppointments});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to retrieve doctor's appointments!",data: error.message});
  }
};

// Function to get appointments for a specific patient

const getPatientAppointment = async (req, res) => {
  const patientId = req.params.id;

  try {
    const currentTime = new Date();
    const formattedCurrentTime = currentTime.toISOString();

    // Update the status of completed appointments for the patient

    await Appointment.updateMany(
      {
        patient: patientId,
        $and: [
          { date: { $lte: formattedCurrentTime } },
          { endTime: { $lte: currentTime.toTimeString() } },
        ],
        appointmentStatus: "pending",
      },
      { $set: { appointmentStatus: "completed" } }
    );

    // Find all paid appointments for the patient and populate patient and doctor names

    const appointments = await Appointment.find({patient: patientId,status: "paid",}).populate("patient", "name").populate("doctorId", "name");

    // Create an array of populated appointment objects

    const populatedAppointments = appointments.map((appointment) => ({
      ...appointment._doc,
      patientName: appointment.patient ? appointment.patient.name : "N/A",
      doctorName: appointment.doctorId ? appointment.doctorId.name : "N/A",
    }));

    res.status(200).json({success: true,message: "Patient's appointments found",data: populatedAppointments});
  } catch (error) {
    res.status(500).json({success: false,message: "Failed to retrieve patient's appointments!",data: error.message});
  }
};

export {createAppointment, updateAppointment, getAllAppointment, getDoctorAppointment, getPatientAppointment};