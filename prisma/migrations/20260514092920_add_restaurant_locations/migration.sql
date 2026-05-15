-- AlterTable
ALTER TABLE "FoodListing" ADD COLUMN     "locationId" TEXT;

-- CreateTable
CREATE TABLE "RestaurantLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "merchantId" TEXT NOT NULL,

    CONSTRAINT "RestaurantLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RestaurantLocation_merchantId_idx" ON "RestaurantLocation"("merchantId");

-- AddForeignKey
ALTER TABLE "FoodListing" ADD CONSTRAINT "FoodListing_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "RestaurantLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantLocation" ADD CONSTRAINT "RestaurantLocation_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
