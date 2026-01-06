-- AlterTable: Adicionar campo obra_ativa_id na tabela usuarios
ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "obra_ativa_id" TEXT;

-- AddForeignKey (opcional, se quiser constraint)
-- ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_obra_ativa_id_fkey" FOREIGN KEY ("obra_ativa_id") REFERENCES "obras"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex (opcional, para performance)
CREATE INDEX IF NOT EXISTS "usuarios_obra_ativa_id_idx" ON "usuarios"("obra_ativa_id");




