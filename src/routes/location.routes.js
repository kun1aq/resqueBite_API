const express = require("express");

const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const locationController = require("../controllers/locationController");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(locationController.createLocationSchema),
  locationController.createLocation
);

router.get(
  "/my",
  authenticate,
  locationController.getMyLocations
);

module.exports = router;