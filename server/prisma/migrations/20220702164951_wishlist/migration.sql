-- CreateTable
CREATE TABLE "Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "marketCap" TEXT NOT NULL,
    "h24" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Client" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coinId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "minimumValue" INTEGER NOT NULL,
    "maximumValue" INTEGER NOT NULL,
    CONSTRAINT "Wishlist_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Client" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Socket" (
    "socketId" TEXT NOT NULL,
    "uuid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_code_key" ON "Coin"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Client_uuid_key" ON "Client"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_coinId_userId_key" ON "Wishlist"("coinId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Socket_socketId_key" ON "Socket"("socketId");

-- CreateIndex
CREATE UNIQUE INDEX "Socket_uuid_key" ON "Socket"("uuid");
