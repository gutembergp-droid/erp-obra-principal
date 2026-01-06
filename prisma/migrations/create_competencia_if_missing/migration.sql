-- Criar tabela competencia_mensal se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'competencia_mensal'
    ) THEN
        -- CreateEnum
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CompetenciaStatus') THEN
            CREATE TYPE "CompetenciaStatus" AS ENUM ('aberta', 'fechada');
        END IF;

        -- CreateEnum
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GateStatus') THEN
            CREATE TYPE "GateStatus" AS ENUM ('pendente', 'em_analise', 'aprovado', 'rejeitado', 'bloqueado');
        END IF;

        -- CreateTable
        CREATE TABLE "competencia_mensal" (
            "id" TEXT NOT NULL,
            "obra_id" TEXT NOT NULL,
            "periodo" TEXT NOT NULL,
            "status" "CompetenciaStatus" NOT NULL DEFAULT 'aberta',
            "aberta_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "fechada_em" TIMESTAMP(3),
            "observacoes" TEXT,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) NOT NULL,
            "deleted_at" TIMESTAMP(3),

            CONSTRAINT "competencia_mensal_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE "competencia_gate" (
            "id" TEXT NOT NULL,
            "competencia_id" TEXT NOT NULL,
            "obra_id" TEXT NOT NULL,
            "numero" INTEGER NOT NULL,
            "nome" TEXT NOT NULL,
            "status" "GateStatus" NOT NULL DEFAULT 'pendente',
            "trava" BOOLEAN NOT NULL DEFAULT false,
            "ordem" INTEGER NOT NULL,
            "aprovado_por_id" TEXT,
            "aprovado_em" TIMESTAMP(3),
            "rejeitado_por_id" TEXT,
            "rejeitado_em" TIMESTAMP(3),
            "motivo_rejeicao" TEXT,
            "observacoes" TEXT,
            "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMP(3) NOT NULL,
            "deleted_at" TIMESTAMP(3),

            CONSTRAINT "competencia_gate_pkey" PRIMARY KEY ("id")
        );

        -- CreateIndex
        CREATE UNIQUE INDEX "competencia_mensal_obra_id_periodo_key" ON "competencia_mensal"("obra_id", "periodo");
        CREATE INDEX "competencia_mensal_obra_id_status_idx" ON "competencia_mensal"("obra_id", "status");
        CREATE INDEX "competencia_mensal_obra_id_idx" ON "competencia_mensal"("obra_id");
        CREATE INDEX "competencia_mensal_status_idx" ON "competencia_mensal"("status");
        CREATE UNIQUE INDEX "competencia_gate_competencia_id_numero_key" ON "competencia_gate"("competencia_id", "numero");
        CREATE INDEX "competencia_gate_competencia_id_idx" ON "competencia_gate"("competencia_id");
        CREATE INDEX "competencia_gate_obra_id_numero_status_idx" ON "competencia_gate"("obra_id", "numero", "status");

        -- AddForeignKey
        ALTER TABLE "competencia_mensal" ADD CONSTRAINT "competencia_mensal_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "competencia_gate" ADD CONSTRAINT "competencia_gate_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencia_mensal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "competencia_gate" ADD CONSTRAINT "competencia_gate_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        ALTER TABLE "competencia_gate" ADD CONSTRAINT "competencia_gate_aprovado_por_id_fkey" FOREIGN KEY ("aprovado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        ALTER TABLE "competencia_gate" ADD CONSTRAINT "competencia_gate_rejeitado_por_id_fkey" FOREIGN KEY ("rejeitado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;


