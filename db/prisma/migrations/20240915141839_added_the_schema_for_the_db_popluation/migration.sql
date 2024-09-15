-- CreateTable
CREATE TABLE "Country" (
    "countryId" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("countryId")
);

-- CreateTable
CREATE TABLE "Location" (
    "locationId" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "locality" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("locationId")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "restaurant_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cuisines" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "thumbImage" TEXT NOT NULL,
    "ratingText" TEXT NOT NULL,
    "ratingColor" TEXT NOT NULL,
    "aggregateRating" DOUBLE PRECISION NOT NULL,
    "votes" INTEGER NOT NULL,
    "averageCostForTwo" DOUBLE PRECISION NOT NULL,
    "hasTableBooking" BOOLEAN NOT NULL,
    "hasOnlineDelivery" BOOLEAN NOT NULL,
    "isDeliveringNow" BOOLEAN NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Country_countryId_key" ON "Country"("countryId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("countryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("locationId") ON DELETE RESTRICT ON UPDATE CASCADE;
