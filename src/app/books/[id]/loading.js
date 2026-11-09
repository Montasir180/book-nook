export default function BookDetailsLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#F7F4EC] px-5 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-[1250px]">

        {/* Back Button Skeleton */}
        <div className="mb-10 h-5 w-36 rounded bg-[#E8E0D3]" />

        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

          {/* Image Skeleton */}
          <div className="mx-auto aspect-[3/4] w-full max-w-[420px] rounded-2xl bg-[#E8E0D3]" />

          {/* Content Skeleton */}
          <div>

            <div className="mb-6 h-8 w-28 rounded-full bg-[#E8E0D3]" />

            <div className="h-16 w-4/5 rounded-lg bg-[#E8E0D3]" />

            <div className="mt-5 h-5 w-48 rounded bg-[#E8E0D3]" />

            <div className="mt-10 h-5 w-40 rounded bg-[#E8E0D3]" />

            <div className="mt-4 h-24 rounded-xl bg-[#E8E0D3]" />

            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3">

              <div className="h-28 rounded-xl bg-[#E8E0D3]" />
              <div className="h-28 rounded-xl bg-[#E8E0D3]" />
              <div className="h-28 rounded-xl bg-[#E8E0D3]" />

            </div>

            <div className="mt-8 h-16 rounded-xl bg-[#E8E0D3]" />

          </div>

        </div>

      </div>

    </main>
  );
}