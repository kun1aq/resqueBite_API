const { z } = require("zod");
const prisma = require("../config/database");
const AppError = require("../utils/AppError");

const createLocationSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    latitude: z.number(),
    longitude: z.number()
  })
});

async function createLocation(req, res, next) {
  try {
    if (req.user.role !== "MERCHANT") {
      throw new AppError("Only merchants can create locations", 403);
    }

    const { name, address, latitude, longitude } = req.validated.body;

    const existing = await prisma.restaurantLocation.findFirst({
      where: {
        merchantId: req.user.id,
        name
      }
    });

    if (existing) {
      throw new AppError("Location with this name already exists", 409);
    }

    const location = await prisma.restaurantLocation.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        merchantId: req.user.id
      }
    });

    res.status(201).json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
}

async function getMyLocations(req, res, next) {
  try {
    if (req.user.role !== "MERCHANT") {
      throw new AppError("Only merchants can view their locations", 403);
    }

    const locations = await prisma.restaurantLocation.findMany({
      where: {
        merchantId: req.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLocationSchema,
  createLocation,
  getMyLocations
};