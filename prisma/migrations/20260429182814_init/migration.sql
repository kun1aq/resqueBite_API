-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MERCHANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "FoodStatus" AS ENUM ('FRESH', 'DISCOUNTED', 'FREE', 'COMPOST');

-- CreateEnum
CREATE TYPE "AllergenType" AS ENUM ('PEANUTS', 'TREE_NUTS', 'MILK', 'EGGS', 'FISH', 'SHELLFISH', 'SOY', 'WHEAT', 'SESAME', 'GLUTEN');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ACTIVE', 'CONFIRMED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAllergy" (
    "id" TEXT NOT NULL,
    "allergen" "AllergenType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserAllergy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodListing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ingredients" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "FoodStatus" NOT NULL DEFAULT 'FRESH',
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "freshUntil" TIMESTAMP(3) NOT NULL,
    "discountedUntil" TIMESTAMP(3) NOT NULL,
    "freeUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "FoodListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockReservation" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,

    CONSTRAINT "StockReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "UserAllergy_userId_allergen_key" ON "UserAllergy"("userId", "allergen");

-- CreateIndex
CREATE INDEX "FoodListing_status_idx" ON "FoodListing"("status");

-- CreateIndex
CREATE INDEX "FoodListing_merchantId_idx" ON "FoodListing"("merchantId");

-- CreateIndex
CREATE INDEX "FoodListing_latitude_longitude_idx" ON "FoodListing"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "StockReservation_status_idx" ON "StockReservation"("status");

-- CreateIndex
CREATE INDEX "StockReservation_expiresAt_idx" ON "StockReservation"("expiresAt");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAllergy" ADD CONSTRAINT "UserAllergy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodListing" ADD CONSTRAINT "FoodListing_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "FoodListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
