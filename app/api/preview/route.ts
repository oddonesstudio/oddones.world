import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { client } from "@/sanity/client";

const clientWithToken = client.withConfig({
  token: process.env.SANITY_API_READ_TOKEN,
});

export async function GET(request: Request) {
  if (!process.env.SANITY_API_READ_TOKEN) {
    return new Response("Missing SANITY_API_READ_TOKEN", { status: 500 });
  }

  const { isValid, redirectTo = "/" } = await validatePreviewUrl(
    clientWithToken,
    request.url,
  );

  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  return redirect(redirectTo);
}
