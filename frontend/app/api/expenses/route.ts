import { NextResponse } from "next/server";
import { requestChapter5 } from "@/lib/api/http";
import type { ExpenseDto } from "@/lib/api/expenses";

export async function GET() {
  try {
    const expenses = await requestChapter5<ExpenseDto[]>("/expenses");

    if (!expenses || expenses.length === 0) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(expenses, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy request failed";
    return NextResponse.json({ message }, { status: 502 });
  }
}
