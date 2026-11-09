import FeaturedBooks from "../components/FeaturedBooks";

export const metadata = {
  title: "All Books | BookNook",
  description: "Explore the complete BookNook collection.",
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-[#F7F4EC] pt-12">

      {/* Page Heading */}
      <div className="mx-auto max-w-[1450px] px-5 pt-8 sm:px-8 lg:px-12">

        <p className="mb-4 text-xs font-bold tracking-[0.22em] text-[#B84E2D] uppercase">
          The BookNook Collection
        </p>

        <h1 className="font-serif text-4xl font-bold text-[#252722] sm:text-5xl lg:text-6xl">
          Explore All Books
          <span className="text-[#B84E2D]">.</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-[#77766F] sm:text-base">
          Discover stories, ideas and knowledge from our growing collection.
          Find your next favourite book and start reading.
        </p>

      </div>

      {/* Books Collection */}
      <div className="mt-8">
        <FeaturedBooks
          showFilters={true}
          showHeading={false}
        />
      </div>

    </main>
  );
}