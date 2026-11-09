import Link from "next/link";

import {
  BookOpen,
  ArrowUpRight,
  Camera,
  Mail,
  MapPin,
  Send,
  Code2,
} from "lucide-react";

import NewsletterForm from "./NewsletterForm.jsx";

async function getCurrentYear() {
  "use cache";

  return new Date().getFullYear();
}

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Home", href: "/" },
      { name: "All Books", href: "/books" },
      { name: "My Books", href: "/my-books" },
      { name: "Add Book", href: "/add-book" },
    ],
  },
  {
    title: "My Library",
    links: [
      { name: "My Borrows", href: "/my-borrows" },
      { name: "Discover Books", href: "/books" },
      { name: "New Arrivals", href: "/books" },
      { name: "My Profile", href: "/profile" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Sign In", href: "/login" },
      { name: "Create Account", href: "/signup" },
      { name: "Contact Us", href: "mailto:hello@booknook.com" },
    ],
  },
];

const socials = [
  {
    icon: Camera,
    href: "#",
    label: "Instagram",
  },
  {
    icon: Code2,
    href: "#",
    label: "GitHub",
  },
];

export default async function Footer() {
  const currentYear = await getCurrentYear();

  return (
    <footer
      id="top"
      className="relative overflow-hidden border-t border-[#E4DED2] bg-[#F7F4EC] text-[#252722]"
    >
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-16 sm:px-8 lg:pt-20">
        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* BRAND */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#252722] text-[#F7F4EC] transition-all duration-500 group-hover:-rotate-6 group-hover:bg-[#B84E2D]">
                <BookOpen size={25} strokeWidth={1.6} />
              </div>

              <span className="font-serif text-3xl font-bold tracking-tight">
                BookNook
                <span className="text-[#B84E2D]">.</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[#77776D]">
              A little corner for every reader. Discover wonderful stories,
              build your personal collection, and find your next favorite book.
            </p>

            {/* SOCIAL ICONS */}
            <div className="mt-7 flex items-center gap-3">
              {socials.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-[#DED8CC] text-[#55584F] transition-all duration-300 hover:-translate-y-1 hover:border-[#B84E2D] hover:bg-[#B84E2D] hover:text-white"
                  >
                    <Icon size={17} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* FOOTER NAVIGATION */}
          {footerLinks.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h3 className="mb-6 font-serif text-lg font-semibold">
                {section.title}
              </h3>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-[#77776D] transition-colors duration-300 hover:text-[#B84E2D]"
                    >
                      {link.name}

                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* CONTACT */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 font-serif text-lg font-semibold">
              Get in Touch
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-[#B84E2D]" />

                <div>
                  <p className="text-xs text-[#999589]">Email us</p>

                  <a
                    href="mailto:hello@booknook.com"
                    className="mt-1 block text-sm transition-colors hover:text-[#B84E2D]"
                  >
                    hello@booknook.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-[#B84E2D]" />

                <div>
                  <p className="text-xs text-[#999589]">Location</p>

                  <p className="mt-1 text-sm">Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEWSLETTER */}
        

        {/* BOTTOM BAR */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-[#DED8CC] pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#89877D]">
            © {currentYear} BookNook. All rights reserved.
          </p>

          <p className="font-serif text-sm italic text-[#77776D]">
            There is no friend as loyal as a book.
          </p>

          
        </div>
      </div>
    </footer>
  );
}
