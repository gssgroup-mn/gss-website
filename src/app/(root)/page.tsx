import type { Metadata } from "next";
import { basePath } from "@/lib/i18n";

// Static export cannot redirect on the server, so the root page forwards to the
// Mongolian home with a meta refresh and keeps a plain link as fallback.
const target = `${basePath}/mn/`;

export const metadata: Metadata = {
  title: "GSS — Globalsmart Solution",
  other: { refresh: `0; url=${target}` },
};

export default function RootPage() {
  return (
    <main className="container-site py-24">
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <p>
        <a href={target} className="underline">
          GSS — Монгол
        </a>{" "}
        ·{" "}
        <a href={`${basePath}/en/`} className="underline">
          English
        </a>
      </p>
    </main>
  );
}
