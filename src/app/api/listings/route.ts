import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const listings = await db.listing.findMany({ take: 25, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ listings });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, kind = "service", pricingType = "fixed", price = 100 } = body;

  const user = await db.user.upsert({
    where: { email: "demo@futureproof.local" },
    update: {},
    create: { email: "demo@futureproof.local" },
  });

  const listing = await db.listing.create({
    data: { title, kind, pricingType, price, userId: user.id },
  });

  return NextResponse.json(listing, { status: 201 });
}
