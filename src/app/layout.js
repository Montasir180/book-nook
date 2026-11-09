import "./globals.css";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

export const metadata = {
  title: "BookNook | Your Personal Library",
  description:
    "Discover books, build your personal library and enjoy reading with BookNook.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}