// "/contact" page. Static server component shell: hero/info copy is inline and
// ContactInfoBoxes reads @/data/contact, while the form itself is ContactForm —
// a client component that validates locally and POSTs the inquiry to the
// backend API (submitContactInquiry in @/lib/api). This is the only public-page
// interaction with the API; the page renders no fetched data.
import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/shared/ContactForm";
import ContactInfoBoxes from "@/components/contact/ContactInfoBoxes";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your business, your project and your goals.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Let's Work Together."
        intro="Tell us about your business, the challenge you're facing and where you want to be. We'll come back with honest thoughts and a clear next step."
      />

      <section className="pb-24 md:pb-32">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 md:px-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactInfoBoxes />
          </div>
        </div>
      </section>
    </main>
  );
}