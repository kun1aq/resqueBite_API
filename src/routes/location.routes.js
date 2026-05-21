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
  "/",
  locationController.getAllLocations
);

router.get(
  "/my",
  authenticate,
  locationController.getMyLocations
);

router.get(
  "/:id",
  authenticate,
  locationController.getLocationById
);

router.patch(
  "/:id",
  authenticate,
  validate(locationController.updateLocationSchema),
  locationController.updateLocation
);

router.delete(
  "/:id",
  authenticate,
  locationController.deleteLocation
);

module.exports = router;