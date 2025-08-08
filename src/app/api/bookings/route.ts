import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { listingId } = body;
  if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  const buyer = await db.user.upsert({
    where: { email: "buyer@futureproof.local" },
    update: {},
    create: { email: "buyer@futureproof.local" },
  });

  const buyerWallet = await db.creditAccount.upsert({
    where: { id: "buyer-wallet" },
    update: {},
    create: { id: "buyer-wallet", ownerId: buyer.id, ownerType: "user" },
  });

  const escrow = await db.creditAccount.upsert({
    where: { id: "escrow-demo" },
    update: {},
    create: { id: "escrow-demo", ownerId: "booking", ownerType: "project" },
  });

  const agg = await db.creditEntry.aggregate({ _sum: { amount: true }, where: { accountId: buyerWallet.id } });
  const bal = agg._sum.amount ?? 0;
  if (bal < listing.price) {
    await db.creditEntry.create({ data: { accountId: buyerWallet.id, amount: listing.price * 2, kind: "grant" } });
  }

  const booking = await db.$transaction(async (tx) => {
    const b = await tx.booking.create({ data: { listingId, buyerUserId: buyer.id, status: "requested" } });
    await tx.creditEntry.create({ data: { accountId: buyerWallet.id, amount: -listing.price, kind: "booking_hold", refType: "booking", refId: b.id } });
    await tx.creditEntry.create({ data: { accountId: escrow.id, amount: listing.price, kind: "booking_hold", refType: "booking", refId: b.id } });
    return b;
  });

  return NextResponse.json(booking, { status: 201 });
}
