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

const updateLocationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    address: z.string().min(5).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional()
  })
});

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

async function getAllLocations(req, res, next) {
  try {
    const locations = await prisma.restaurantLocation.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      count: locations.length,
      data: locations
    });
  } catch (error) {
    next(error);
  }
}

async function getLocationById(req, res, next) {
  try {
    const { id } = req.params;

    const location = await prisma.restaurantLocation.findUnique({
      where: { id }
    });

    if (!location) {
      throw new AppError("Location not found", 404);
    }

    res.json({
      success: true,
      data: location
    });
  } catch (error) {
    next(error);
  }
}

async function updateLocation(req, res, next) {
  try {
    if (req.user.role !== "MERCHANT") {
      throw new AppError("Only merchants can update locations", 403);
    }

    const { id } = req.params;

    const location = await prisma.restaurantLocation.findUnique({
      where: { id }
    });

    if (!location) {
      throw new AppError("Location not found", 404);
    }

    if (location.merchantId !== req.user.id) {
      throw new AppError("Forbidden", 403);
    }

    const updatedLocation = await prisma.restaurantLocation.update({
      where: { id },
      data: req.validated.body
    });

    res.json({
      success: true,
      data: updatedLocation
    });
  } catch (error) {
    next(error);
  }
}

async function deleteLocation(req, res, next) {
  try {
    if (req.user.role !== "MERCHANT") {
      throw new AppError("Only merchants can delete locations", 403);
    }

    const { id } = req.params;

    const location = await prisma.restaurantLocation.findUnique({
      where: { id }
    });

    if (!location) {
      throw new AppError("Location not found", 404);
    }

    if (location.merchantId !== req.user.id) {
      throw new AppError("Forbidden", 403);
    }

    await prisma.restaurantLocation.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: "Location deleted successfully"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLocationSchema,
  updateLocationSchema,
  createLocation,
  getMyLocations,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
};