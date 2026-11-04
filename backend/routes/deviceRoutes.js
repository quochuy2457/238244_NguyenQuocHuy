const express = require("express");

const router = express.Router();

const controller = require("../controllers/deviceController");

const validateDevice = require("../middleware/validateDevice");

router.route("/")
  .get(controller.getDevices)
  .post(validateDevice(), controller.createDevice);

router.route("/:id")
  .get(controller.getDeviceById)
  .put(
    validateDevice({ partial: true }),
    controller.updateDevice
  )
  .delete(controller.deleteDevice);

module.exports = router;