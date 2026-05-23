const appointmentSvc = require("./appointment.service");

class AppointmentController {
  create = async (req, res, next) => {

    try {
    console.log("Request REached")
    const { customer_id, service_id, start_time, end_time } = req.body;
    console.log("Creating appointment for:", { customer_id, service_id });
    const newAppt = await appointmentSvc.createAppointment({
      customer_id, 
      service_id, 
      start_time, 
      end_time
    });

    res.status(201).json({ result: newAppt });
  }
    catch (exception) {
      next(exception);
    }
  };

  listAll = async (req, res, next) => {
    try {
      const appointments = await appointmentSvc.getAllAppointments();
      res.json({ result: appointments });
    } catch (exception) {
      next(exception);
    }
  };

  getByCustomer = async (req, res, next) => {
    try {
      const appointments = await appointmentSvc.getAppointmentsByCustomer(req.params.customerId);
      res.json({ result: appointments });
    } catch (exception) {
      next(exception);
    }
  };

  update = async (req, res, next) => {
    try {
      const updatedAppt = await appointmentSvc.updateAppointment(req.params.id, req.body);
      if (!updatedAppt) return res.status(404).json({ message: "Appointment not found." });
      
      res.json({ result: updatedAppt, message: "Appointment updated successfully." });
    } catch (exception) {
      next(exception);
    }
  };

  deleteAppointment = async (req, res, next) => {
    try {
      const deleted = await appointmentSvc.deleteAppointment(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Appointment not found." });
      
      res.json({ message: "Appointment deleted successfully." });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new AppointmentController();