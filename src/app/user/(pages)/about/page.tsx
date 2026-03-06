import type { Metadata } from "next";
import About from "./About";

export const metadata: Metadata = {
  title: "About Us - MediConnection",
  description:
    "Learn more about MediConnection, our mission, and our team dedicated to connecting patients with healthcare professionals.",
};

export default function AboutPage() {
  return <About />;
}
