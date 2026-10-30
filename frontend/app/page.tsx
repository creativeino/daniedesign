// Home page ("/"). Static server component: this file only composes the landing
// page, and each section component below pulls its own content from the static
// data/ files (clients, services, projects, blog posts, stats) or ships its
// copy inline — nothing is fetched from the backend API.
import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ClientsMarquee from "@/components/home/ClientsMarquee";
import AgencyIntro from "@/components/home/AgencyIntro";
import Services from "@/components/home/Services";
import Process from "@/components/home/Process";
import CreativeMarquee from "@/components/home/CreativeMarquee";
import TrustStatement from "@/components/home/TrustStatement";
import FeaturedWork from "@/components/home/FeaturedWork";
import FeaturedStack from "@/components/home/FeaturedStack";
import ImpactStats from "@/components/home/ImpactStats";
import BlogPreview from "@/components/home/BlogPreview";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ClientsMarquee />
      <AgencyIntro />
      <Services />
      <Process />
      <CreativeMarquee />
      <TrustStatement />
      <FeaturedWork />
      <FeaturedStack />
      <ImpactStats />
      <BlogPreview />
    </main>
  );
}