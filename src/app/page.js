import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import RecentlyUploaded from "./components/RecentlyUploaded";
import ExploreCategories from "./components/ExploreCategories";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <RecentlyUploaded />
      <FeaturedBooks />
      <ExploreCategories />
    </main>
  );
}