-- CreateTable
CREATE TABLE "SellSubmission" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "mileage" TEXT NOT NULL,
    "vin" TEXT NOT NULL,
    "notes" TEXT,
    "sellOption" TEXT NOT NULL DEFAULT 'sell',
    "existingCustomer" BOOLEAN NOT NULL DEFAULT false,
    "newsletter" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SellSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SellSubmission_email_idx" ON "SellSubmission"("email");

-- CreateIndex
CREATE INDEX "SellSubmission_status_idx" ON "SellSubmission"("status");

-- CreateIndex
CREATE INDEX "SellSubmission_createdAt_idx" ON "SellSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "SellSubmission_sellOption_idx" ON "SellSubmission"("sellOption");
