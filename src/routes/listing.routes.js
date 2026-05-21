const express = require("express");

const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const listingController = require("../controllers/listingController");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(listingController.createListingSchema),
  listingController.createListing
);

router.get("/", listingController.getListings);

router.patch(
  "/:id/status",
  authenticate,
  listingController.updateListingStatus
);
router.post(
  "/allergy-check",
  authenticate,
  validate(listingController.allergyParserSchema),
  listingController.checkAllergies
);
router.patch(
  "/:id",
  authenticate,
  validate(listingController.updateListingSchema),
  listingController.updateListing
);

router.delete(
  "/:id",
  authenticate,
  listingController.deleteListing
);
module.exports = router;