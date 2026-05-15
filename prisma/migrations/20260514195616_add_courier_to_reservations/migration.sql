-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('WAITING_FOR_COURIER', 'ACCEPTED_BY_COURIER', 'PICKED_UP', 'DELIVERING', 'DELIVERED');

-- AlterTable
ALTER TABLE "StockReservation" ADD COLUMN     "courierId" TEXT,
ADD COLUMN     "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'WAITING_FOR_COURIER';

-- CreateIndex
CREATE INDEX "StockReservation_deliveryStatus_idx" ON "StockReservation"("deliveryStatus");

-- CreateIndex
CREATE INDEX "StockReservation_courierId_idx" ON "StockReservation"("courierId");

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
