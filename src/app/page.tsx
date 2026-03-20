import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ListingsGrid from "@/components/ListingsGrid";
import ValueProps from "@/components/ValueProps";
import CTAStrip from "@/components/CTAStrip";
import Footer from "@/components/Footer";
import { Listing } from "@/components/ListingCard";

const listings: Listing[] = [
  {
    price: "$549,000",
    address: "2847 Crestview Dr",
    city: "Loveland, CO 80538",
    beds: 4,
    baths: 3,
    sqft: "2,340",
    acres: "0.22",
    status: "Active",
    gradientId: "g1",
    gradientStart: "#1a4d1a",
    gradientEnd: "#2d7a2d",
    svgVariant: 1,
  },
  {
    price: "$785,000",
    address: "1104 Foothills Pkwy",
    city: "Fort Collins, CO 80525",
    beds: 5,
    baths: 4,
    sqft: "3,180",
    acres: "0.35",
    status: "Pending",
    gradientId: "g2",
    gradientStart: "#0f2e0f",
    gradientEnd: "#1a4d1a",
    svgVariant: 2,
  },
  {
    price: "$389,500",
    address: "518 Mountain Ave",
    city: "Berthoud, CO 80513",
    beds: 3,
    baths: 2,
    sqft: "1,720",
    acres: "0.18",
    status: "Active",
    gradientId: "g3",
    gradientStart: "#2d7a2d",
    gradientEnd: "#339933",
    svgVariant: 3,
  },
];

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <SearchBar />
      <ListingsGrid listings={listings} />
      <ValueProps />
      <CTAStrip />
      <Footer />
    </>
  );
}
