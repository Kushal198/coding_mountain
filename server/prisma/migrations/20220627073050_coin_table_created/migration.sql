-- CreateTable
CREATE TABLE "Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "marketCap" TEXT NOT NULL,
    "h24" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_code_key" ON "Coin"("code");
