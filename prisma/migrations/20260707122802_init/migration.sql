-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "CariTipi" AS ENUM ('MUSTERI', 'TEDARIKCI', 'TASERON', 'PERSONEL', 'DIGER');

-- CreateEnum
CREATE TYPE "OdemeTuru" AS ENUM ('NAKIT', 'HAVALE', 'CEK', 'SENET');

-- CreateEnum
CREATE TYPE "IslemYonu" AS ENUM ('TAHSILAT', 'ODEME');

-- CreateEnum
CREATE TYPE "IslemDurumu" AS ENUM ('TAMAMLANDI', 'BEKLEMEDE', 'VADESI_GELDI', 'KARSILIKSIZ', 'IPTAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cari" (
    "id" TEXT NOT NULL,
    "unvan" TEXT NOT NULL,
    "tip" "CariTipi" NOT NULL DEFAULT 'DIGER',
    "telefon" TEXT,
    "adres" TEXT,
    "vergiNo" TEXT,
    "notlar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Islem" (
    "id" TEXT NOT NULL,
    "cariId" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "yon" "IslemYonu" NOT NULL,
    "tutar" DECIMAL(14,2) NOT NULL,
    "odemeTuru" "OdemeTuru" NOT NULL,
    "aciklama" TEXT,
    "vadeTarihi" TIMESTAMP(3),
    "durum" "IslemDurumu" NOT NULL DEFAULT 'TAMAMLANDI',
    "olusturanId" TEXT NOT NULL,
    "onaylayanId" TEXT,
    "tamamlanmaTarihi" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Islem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Cari_unvan_idx" ON "Cari"("unvan");

-- CreateIndex
CREATE INDEX "Islem_cariId_idx" ON "Islem"("cariId");

-- CreateIndex
CREATE INDEX "Islem_durum_idx" ON "Islem"("durum");

-- CreateIndex
CREATE INDEX "Islem_odemeTuru_idx" ON "Islem"("odemeTuru");

-- CreateIndex
CREATE INDEX "Islem_vadeTarihi_idx" ON "Islem"("vadeTarihi");

-- AddForeignKey
ALTER TABLE "Islem" ADD CONSTRAINT "Islem_cariId_fkey" FOREIGN KEY ("cariId") REFERENCES "Cari"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Islem" ADD CONSTRAINT "Islem_olusturanId_fkey" FOREIGN KEY ("olusturanId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Islem" ADD CONSTRAINT "Islem_onaylayanId_fkey" FOREIGN KEY ("onaylayanId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

