// 404 page. Next renders this automatically for any unmatched route, and it is
// also the target of notFound() calls in the dynamic /work/[slug] and /blog/[slug]
// pages. Fully static — no data source.
import Button from "@/components/shared/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">404 · Lost in the archive</p>
      <h1 className="display mt-6 text-5xl font-medium leading-[1] tracking-tight text-ink md:text-7xl">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-muted md:text-base">
        The page you&apos;re looking for doesn&apos;t exist, but we&apos;d love to design it for you.
      </p>
      <Button href="/" variant="primary" size="lg" className="mt-10">
        Back to Home
      </Button>
    </main>
  );
}