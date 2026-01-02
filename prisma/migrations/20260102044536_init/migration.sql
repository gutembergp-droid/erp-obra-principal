-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" TEXT NOT NULL DEFAULT 'usuario',
    "is_ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cliente" TEXT,
    "data_inicio" TIMESTAMP(3),
    "data_fim_prevista" TIMESTAMP(3),
    "data_fim_real" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'planejamento',
    "orcamento_total" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_obra" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "obra_id" TEXT NOT NULL,
    "permissao" TEXT NOT NULL DEFAULT 'leitura',
    "is_ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuario_obra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baseline_comercial" (
    "id" TEXT NOT NULL,
    "obra_id" TEXT NOT NULL,
    "versao" INTEGER NOT NULL,
    "descricao" TEXT,
    "data_aprovacao" TIMESTAMP(3),
    "aprovado_por" TEXT,
    "valor_total" DECIMAL(15,2) NOT NULL,
    "is_ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "baseline_comercial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eap" (
    "id" TEXT NOT NULL,
    "baseline_comercial_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "eap_pai_id" TEXT,
    "unidade_medida" TEXT,
    "quantidade" DECIMAL(15,4),
    "valor_unitario" DECIMAL(15,2),
    "valor_total" DECIMAL(15,2),
    "ordem" INTEGER NOT NULL,
    "is_folha" BOOLEAN NOT NULL DEFAULT false,
    "usuario_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "eap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eap_fator_conversao" (
    "id" TEXT NOT NULL,
    "eap_comercial_id" TEXT NOT NULL,
    "eap_operacional_id" TEXT NOT NULL,
    "fator_quantidade" DECIMAL(15,6) NOT NULL,
    "fator_valor" DECIMAL(15,6),
    "observacoes" TEXT,
    "is_ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "eap_fator_conversao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gates" (
    "id" TEXT NOT NULL,
    "obra_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'meio',
    "ordem" INTEGER NOT NULL,
    "data_prevista" TIMESTAMP(3),
    "data_real" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "usuario_id" TEXT,
    "aprovado_por" TEXT,
    "usuario_aprovador_id" TEXT,
    "data_aprovacao" TIMESTAMP(3),
    "observacoes" TEXT,
    "criterios_aprovacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicoes" (
    "id" TEXT NOT NULL,
    "obra_id" TEXT NOT NULL,
    "eap_id" TEXT,
    "usuario_id" TEXT NOT NULL,
    "periodo_referencia" TEXT NOT NULL,
    "data_medicao" TIMESTAMP(3) NOT NULL,
    "quantidade_medida" DECIMAL(15,4) NOT NULL,
    "valor_medido" DECIMAL(15,2),
    "observacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'rascunho',
    "aprovado_por_id" TEXT,
    "data_aprovacao" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "medicoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_perfil_idx" ON "usuarios"("perfil");

-- CreateIndex
CREATE INDEX "usuarios_is_ativo_idx" ON "usuarios"("is_ativo");

-- CreateIndex
CREATE UNIQUE INDEX "obras_codigo_key" ON "obras"("codigo");

-- CreateIndex
CREATE INDEX "usuario_obra_usuario_id_idx" ON "usuario_obra"("usuario_id");

-- CreateIndex
CREATE INDEX "usuario_obra_obra_id_idx" ON "usuario_obra"("obra_id");

-- CreateIndex
CREATE INDEX "usuario_obra_is_ativo_idx" ON "usuario_obra"("is_ativo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_obra_usuario_id_obra_id_key" ON "usuario_obra"("usuario_id", "obra_id");

-- CreateIndex
CREATE UNIQUE INDEX "baseline_comercial_obra_id_versao_key" ON "baseline_comercial"("obra_id", "versao");

-- CreateIndex
CREATE INDEX "eap_baseline_comercial_id_idx" ON "eap"("baseline_comercial_id");

-- CreateIndex
CREATE INDEX "eap_eap_pai_id_idx" ON "eap"("eap_pai_id");

-- CreateIndex
CREATE INDEX "eap_tipo_idx" ON "eap"("tipo");

-- CreateIndex
CREATE INDEX "eap_usuario_id_idx" ON "eap"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "eap_baseline_comercial_id_codigo_key" ON "eap"("baseline_comercial_id", "codigo");

-- CreateIndex
CREATE INDEX "eap_fator_conversao_eap_comercial_id_idx" ON "eap_fator_conversao"("eap_comercial_id");

-- CreateIndex
CREATE INDEX "eap_fator_conversao_eap_operacional_id_idx" ON "eap_fator_conversao"("eap_operacional_id");

-- CreateIndex
CREATE INDEX "eap_fator_conversao_is_ativo_idx" ON "eap_fator_conversao"("is_ativo");

-- CreateIndex
CREATE UNIQUE INDEX "eap_fator_conversao_eap_comercial_id_eap_operacional_id_key" ON "eap_fator_conversao"("eap_comercial_id", "eap_operacional_id");

-- CreateIndex
CREATE INDEX "gates_obra_id_idx" ON "gates"("obra_id");

-- CreateIndex
CREATE INDEX "gates_usuario_id_idx" ON "gates"("usuario_id");

-- CreateIndex
CREATE INDEX "gates_usuario_aprovador_id_idx" ON "gates"("usuario_aprovador_id");

-- CreateIndex
CREATE INDEX "gates_status_idx" ON "gates"("status");

-- CreateIndex
CREATE INDEX "gates_ordem_idx" ON "gates"("ordem");

-- CreateIndex
CREATE UNIQUE INDEX "gates_obra_id_codigo_key" ON "gates"("obra_id", "codigo");

-- CreateIndex
CREATE INDEX "medicoes_obra_id_idx" ON "medicoes"("obra_id");

-- CreateIndex
CREATE INDEX "medicoes_eap_id_idx" ON "medicoes"("eap_id");

-- CreateIndex
CREATE INDEX "medicoes_usuario_id_idx" ON "medicoes"("usuario_id");

-- CreateIndex
CREATE INDEX "medicoes_periodo_referencia_idx" ON "medicoes"("periodo_referencia");

-- CreateIndex
CREATE INDEX "medicoes_data_medicao_idx" ON "medicoes"("data_medicao");

-- CreateIndex
CREATE INDEX "medicoes_status_idx" ON "medicoes"("status");

-- AddForeignKey
ALTER TABLE "usuario_obra" ADD CONSTRAINT "usuario_obra_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_obra" ADD CONSTRAINT "usuario_obra_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baseline_comercial" ADD CONSTRAINT "baseline_comercial_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap" ADD CONSTRAINT "eap_baseline_comercial_id_fkey" FOREIGN KEY ("baseline_comercial_id") REFERENCES "baseline_comercial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap" ADD CONSTRAINT "eap_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap" ADD CONSTRAINT "eap_eap_pai_id_fkey" FOREIGN KEY ("eap_pai_id") REFERENCES "eap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap_fator_conversao" ADD CONSTRAINT "eap_fator_conversao_eap_comercial_id_fkey" FOREIGN KEY ("eap_comercial_id") REFERENCES "eap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eap_fator_conversao" ADD CONSTRAINT "eap_fator_conversao_eap_operacional_id_fkey" FOREIGN KEY ("eap_operacional_id") REFERENCES "eap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gates" ADD CONSTRAINT "gates_usuario_aprovador_id_fkey" FOREIGN KEY ("usuario_aprovador_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_obra_id_fkey" FOREIGN KEY ("obra_id") REFERENCES "obras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_eap_id_fkey" FOREIGN KEY ("eap_id") REFERENCES "eap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_aprovado_por_id_fkey" FOREIGN KEY ("aprovado_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
