import { NextResponse } from "next/server";
import { resume } from "@/lib/resume";

// Static GET REST endpoint. With `output: export`, Next.js pre-renders this to
// out/api/resume/index.html-equivalent JSON, so the deployed S3 site serves a
// real GET /api/resume/ resource with no server required.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(resume);
}
