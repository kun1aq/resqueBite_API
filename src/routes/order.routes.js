const express = require("express");

const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(orderController.createReservationSchema),
  orderController.createReservation
);

router.get(
  "/my",
  authenticate,
  orderController.myReservations
);

router.patch(
  "/:id/confirm",
  authenticate,
  orderController.confirmReservation
);

router.patch(
  "/:id/cancel",
  authenticate,
  orderController.cancelReservation
);

/* =========================
   COURIER ROUTES
========================= */

router.get(
  "/deliveries/available",
  authenticate,
  orderController.getAvailableDeliveries
);

router.get(
  "/deliveries/my",
  authenticate,
  orderController.myDeliveries
);

router.patch(
  "/:id/accept-delivery",
  authenticate,
  orderController.acceptDelivery
);

router.patch(
  "/:id/delivery-status",
  authenticate,
  validate(orderController.updateDeliveryStatusSchema),
  orderController.updateDeliveryStatus
);

module.exports = router;