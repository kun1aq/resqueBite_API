const prisma = require("../config/database");
const AppError = require("../utils/AppError");

exports.createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;

    if (!listingId) {
      return next(new AppError("listingId is required", 400));
    }

    if (!rating) {
      return next(new AppError("rating is required", 400));
    }

    if (rating < 1 || rating > 5) {
      return next(new AppError("Rating must be between 1 and 5", 400));
    }

    const listing = await prisma.foodListing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return next(new AppError("Listing not found", 404));
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        listingId,
        rating,
        comment
      }
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review
    });
  } catch (error) {
    if (error.code === "P2002") {
      return next(new AppError("You already reviewed this listing", 409));
    }

    next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

exports.getListingReviews = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const reviews = await prisma.review.findMany({
      where: {
        listingId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};


exports.getAllReviews = async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};