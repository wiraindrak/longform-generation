import { NextRequest } from "next/server";
import { query } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const { rows } = await query(
      "SELECT * FROM generations WHERE id = $1",
      [id]
    );
    if (rows.length === 0)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ generation: rows[0] });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const result = await query(
      "DELETE FROM generations WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ deleted: id });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
