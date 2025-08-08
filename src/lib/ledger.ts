import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function postEntry({
  accountId,
  amount,
  kind,
  refType,
  refId,
}: {
  accountId: string;
  amount: number;
  kind: string;
  refType?: string;
  refId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.creditEntry.create({
      data: { accountId, amount, kind, refType, refId },
    });
    await tx.auditLog.create({
      data: { action: "ledger.post", data: { accountId, amount, kind, refType, refId } },
    });
    return entry;
  });
}

export async function transfer({
  fromId,
  toId,
  amount,
  kind,
  refType,
  refId,
}: {
  fromId: string;
  toId: string;
  amount: number;
  kind: string;
  refType?: string;
  refId?: string;
}) {
  return prisma.$transaction(async (tx) => {
    await tx.creditEntry.create({ data: { accountId: fromId, amount: -amount, kind, refType, refId } });
    await tx.creditEntry.create({ data: { accountId: toId, amount, kind, refType, refId } });
  });
}
