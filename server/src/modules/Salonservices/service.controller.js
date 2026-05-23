const serviceSvc = require("./service.services");

class ServiceController {
create = async (req, res, next) => {
    try {
      const { name, description, price, duration_minutes } = req.body;

      if (!name || !price || !duration_minutes) {
        return res.status(422).json({ message: "Name, price, and duration are required fields." });
      }

      const newService = await serviceSvc.createService({
        name,
        description,
        price,
        duration_minutes: parseInt(duration_minutes),
      });

      // Fixed status code typo to 201
      return res.status(201).json({
        result: newService,
        message: "Salon service created successfully.",
        meta: null,
      });
    } catch (exception) {
      console.error("Error creating service:", exception);
      next(exception);
    }
  };

  listAll = async (req, res, next) => {
    try {
     const role = req.authUser?.role?.toLowerCase();

const isAdmin = role === "admin";
   
      const services = await serviceSvc.getAllServices(isAdmin);

      return res.json({
        result: services,
        message: "Services fetched successfully.",
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  getById = async (req, res, next) => {
    try {
      const service = await serviceSvc.getServiceById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({
        result: service,
        message: "Service details retrieved successfully.",
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

 update = async (req, res, next) => {
  try {
    const id = req.params.id;

    // 1. Verify the service target actually exists first
    const currentService = await serviceSvc.getServiceById(id);
    if (!currentService) {
      return res.status(404).json({ message: "Service target not found." });
    }

    // 2. Safely merge incoming fields with existing DB values to protect NOT NULL constraints
    const { name, description, price, duration_minutes, is_active } = req.body;

    const updateData = {
      name: name !== undefined ? name : currentService.name,
      description: description !== undefined ? description : currentService.description,
      price: price !== undefined ? price : currentService.price,
      duration_minutes: duration_minutes !== undefined ? parseInt(duration_minutes) : currentService.duration_minutes,
      is_active: is_active !== undefined ? is_active : currentService.is_active, // 👈 Ensures it never falls to null
    };

    // 3. Execute the update patch
    const updatedService = await serviceSvc.updateService(id, updateData);

    res.json({
      result: updatedService,
      message: "Service configuration patched successfully.",
      meta: null,
    });
  } catch (exception) {
    console.error("Error patching service:", exception);
    next(exception);
  }
};

  deleteService = async (req, res, next) => {
    try {
      const id = req.params.id;
      console.log(`[HARD DELETE] Target ID requested: ${id}`);
      
      const target = await serviceSvc.getServiceById(id);
      if (!target) {
        console.warn(`[WARN] Service ID ${id} doesn't exist.`);
        return res.status(404).json({ message: "Service not found in database." });
      }

      console.log(`[DB EXECUTION] Permanently deleting row: "${target.name}"`);
      const deletedResult = await serviceSvc.hardDeleteService(id); 
      console.log(`[DB SUCCESS] Row removed permanently from PostgreSQL.`);

      return res.json({
        result: deletedResult,
        message: "Service permanently deleted from the database.",
        meta: null,
      });
    } catch (exception) {
      console.error("[ERROR] Hard delete failed:", exception);
      next(exception);
    }
  };

}

module.exports = new ServiceController();