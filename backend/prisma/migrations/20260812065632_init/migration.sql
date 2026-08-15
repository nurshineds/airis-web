-- CreateTable
CREATE TABLE "Admin" (
    "idAdmin" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("idAdmin")
);

-- CreateTable
CREATE TABLE "webContent" (
    "idContent" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "symbol" VARCHAR(20),
    "icon" VARCHAR(10),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webContent_pkey" PRIMARY KEY ("idContent")
);

-- CreateTable
CREATE TABLE "thresholdValue" (
    "idIndicator" SERIAL NOT NULL,
    "indicatorName" VARCHAR(50) NOT NULL,
    "indicatorUnit" VARCHAR(20) NOT NULL,
    "maxTresholdValue" DOUBLE PRECISION NOT NULL,
    "minTresholdValue" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "thresholdValue_pkey" PRIMARY KEY ("idIndicator")
);

-- CreateTable
CREATE TABLE "devices" (
    "idDevices" SERIAL NOT NULL,
    "deviceLocated" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("idDevices")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
