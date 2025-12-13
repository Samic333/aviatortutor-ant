import prisma from "@/lib/prisma";
import { headers } from "next/headers";

type AuditStatus = "SUCCESS" | "FAIL";
type ActorRole = "STUDENT" | "INSTRUCTOR" | "ADMIN" | "SUPER_ADMIN" | "OWNER" | "SYSTEM";

interface AuditLogParams {
    action: string;
    entityType: string;
    entityId?: string;
    actor: {
        id: string;
        role: string;
        email?: string;
    } | null; // Null for system
    targetUserId?: string;
    status: AuditStatus;
    metadata?: Record<string, any>;
}

/**
 * centralized Audit Logging helper using Prisma.
 * Swallows errors to prevent breaking critical business flows, but logs to console.
 */
export async function logAuditAction(params: AuditLogParams) {
    try {
        const headerList = headers();
        const ip = headerList.get("x-forwarded-for") || "unknown";
        const userAgent = headerList.get("user-agent") || "unknown";

        await prisma.auditLog.create({
            data: {
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                actorId: params.actor?.id,
                actorRole: params.actor?.role || "SYSTEM",
                targetUserId: params.targetUserId,
                status: params.status,
                metadata: params.metadata || {},
                ip,
                userAgent
            }
        });
    } catch (error) {
        // FAIL SAFE: Never throw from audit logging
        console.error("CRITICAL: Failed to write AuditLog", error, params);
    }
}
