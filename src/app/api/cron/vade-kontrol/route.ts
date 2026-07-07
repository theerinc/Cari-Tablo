import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const result = await prisma.islem.updateMany({
    where: { durum: "BEKLEMEDE", vadeTarihi: { lte: new Date() } },
    data: { durum: "VADESI_GELDI" },
  });

  return NextResponse.json({ guncellenen: result.count });
}
