import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import FeaturedListings from "@/components/FeaturedListings";
import ValueProps from "@/components/ValueProps";
import CTAStrip from "@/components/CTAStrip";
import Footer from "@/components/Footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["RealEstateAgent", "LocalBusiness"],
      "@id": "https://970.re/#business",
      "name": "970.re — Rich Kopcho, Broker",
      "url": "https://970.re",
      "telephone": "+1-970-669-8677",
      "description":
        "Rich Kopcho, Colorado licensed real estate broker with 50 years of Northern Colorado experience. Affiliated with Better Homes & Gardens Real Estate — Neuhaus.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Better Homes & Gardens Real Estate — Neuhaus",
        "addressLocality": "Loveland",
        "addressRegion": "CO",
        "postalCode": "80538",
        "addressCountry": "US",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.3978,
        "longitude": -105.0749,
      },
      "areaServed": [
        { "@type": "City", "name": "Loveland", "containedIn": "Larimer County, Colorado" },
        { "@type": "City", "name": "Fort Collins", "containedIn": "Larimer County, Colorado" },
        { "@type": "City", "name": "Berthoud", "containedIn": "Larimer County, Colorado" },
        { "@type": "City", "name": "Wellington", "containedIn": "Larimer County, Colorado" },
        { "@type": "City", "name": "Timnath", "containedIn": "Larimer County, Colorado" },
        { "@type": "City", "name": "Longmont", "containedIn": "Boulder County, Colorado" },
      ],
      "knowsAbout": [
        "Northern Colorado Real Estate",
        "Home Buying",
        "Home Selling",
        "Investment Properties",
        "Larimer County Real Estate",
      ],
      "hasCredential": "Colorado Licensed Real Estate Broker",
      "memberOf": {
        "@type": "Organization",
        "name": "Better Homes & Gardens Real Estate — Neuhaus",
      },
      "sameAs": ["https://970.re"],
    },
    {
      "@type": "WebSite",
      "@id": "https://970.re/#website",
      "url": "https://970.re",
      "name": "970.re",
      "description": "Northern Colorado Real Estate — Know the 970.",
      "publisher": { "@id": "https://970.re/#business" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://970.re/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Who is Rich Kopcho?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rich Kopcho is a Colorado licensed real estate broker with 50 years of experience in Northern Colorado. He is affiliated with Better Homes & Gardens Real Estate — Neuhaus in Loveland, CO.",
          },
        },
        {
          "@type": "Question",
          "name": "What areas does 970.re serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "970.re serves the entire Northern Colorado 970 area code, including Loveland, Fort Collins, Berthoud, Wellington, Timnath, and Longmont across Larimer and Weld counties.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I get a free home valuation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Visit https://970.re/valuation to request a free, data-backed home valuation from Rich Kopcho. This is a real market analysis, not an automated estimate.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I search for homes in Northern Colorado?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Use the MLS search at https://970.re/search to find homes in Fort Collins, Loveland, Berthoud, Wellington, and across Northern Colorado.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <SearchBar />
      <FeaturedListings />
      <ValueProps />
      <CTAStrip />
      <Footer />
    </>
  );
}
