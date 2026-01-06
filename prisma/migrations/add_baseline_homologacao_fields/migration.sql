-- AlterTable: Adicionar campos de homologação em baseline_comercial
ALTER TABLE "baseline_comercial" 
  ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'proposta',
  ADD COLUMN IF NOT EXISTS "proposta_por" TEXT,
  ADD COLUMN IF NOT EXISTS "proposta_em" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "homologada_por" TEXT,
  ADD COLUMN IF NOT EXISTS "homologada_em" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rejeitada_por" TEXT,
  ADD COLUMN IF NOT EXISTS "rejeitada_em" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "motivo_rejeicao" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "baseline_comercial_status_idx" ON "baseline_comercial"("status");

-- AddForeignKey (se as colunas existirem)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'baseline_comercial_proposta_por_fkey'
  ) THEN
    ALTER TABLE "baseline_comercial" 
      ADD CONSTRAINT "baseline_comercial_proposta_por_fkey" 
      FOREIGN KEY ("proposta_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'baseline_comercial_homologada_por_fkey'
  ) THEN
    ALTER TABLE "baseline_comercial" 
      ADD CONSTRAINT "baseline_comercial_homologada_por_fkey" 
      FOREIGN KEY ("homologada_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'baseline_comercial_rejeitada_por_fkey'
  ) THEN
    ALTER TABLE "baseline_comercial" 
      ADD CONSTRAINT "baseline_comercial_rejeitada_por_fkey" 
      FOREIGN KEY ("rejeitada_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;


