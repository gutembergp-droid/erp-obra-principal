-- CreateEnum
CREATE TYPE "MedicaoStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "medicoes" 
  ADD COLUMN "competencia_id" TEXT,
  ADD COLUMN "rejeitado_por_id" TEXT,
  ADD COLUMN "data_rejeicao" TIMESTAMP(3),
  ADD COLUMN "motivo_rejeicao" TEXT;

-- AlterTable: Migrar status antigo para novo enum
-- Primeiro, alterar coluna status para usar o novo enum
ALTER TABLE "medicoes" 
  ALTER COLUMN "status" DROP DEFAULT;

-- Converter valores antigos para novos
UPDATE "medicoes" SET "status" = 'DRAFT' WHERE "status" = 'rascunho';
UPDATE "medicoes" SET "status" = 'SUBMITTED' WHERE "status" = 'enviada';
UPDATE "medicoes" SET "status" = 'APPROVED' WHERE "status" = 'aprovada';
UPDATE "medicoes" SET "status" = 'REJECTED' WHERE "status" = 'rejeitada';

-- Alterar tipo da coluna
ALTER TABLE "medicoes" 
  ALTER COLUMN "status" TYPE "MedicaoStatus" USING "status"::"MedicaoStatus",
  ALTER COLUMN "status" SET DEFAULT 'DRAFT';

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencia_mensal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_rejeitado_por_id_fkey" FOREIGN KEY ("rejeitado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "medicoes_competencia_id_idx" ON "medicoes"("competencia_id");

