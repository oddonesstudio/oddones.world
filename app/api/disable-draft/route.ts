import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();
  const url = new URL(request.url);
  const redirectPath = url.searchParams.get("redirect") || "/";
  const redirectUrl =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//")
      ? new URL(redirectPath, url.origin)
      : new URL("/", url.origin);

  return NextResponse.redirect(redirectUrl);
}
