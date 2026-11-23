import type { Metadata } from "next";
import ComponentsShowcase from "@/components/ComponentsShowcase";

import GooeyNavbar from "@/components/GooeyNavbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Examples" };

export default function Examples() {
  return (
    <>
      <GooeyNavbar />
      <ComponentsShowcase catalog />
      <Footer />
    </>
  );
}
