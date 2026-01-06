-- CreateTable
CREATE TABLE IF NOT EXISTS "audit_events" (
    "id" TEXT NOT NULL,
    "obra_id" TEXT,
    "usuario_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "action" TEXT NOT NULL,
    "payload_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_obra_id_idx" ON "audit_events"("obra_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_usuario_id_idx" ON "audit_events"("usuario_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_entity_type_idx" ON "audit_events"("entity_type");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_action_idx" ON "audit_events"("action");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "audit_events_created_at_idx" ON "audit_events"("created_at");

