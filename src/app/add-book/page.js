import AddBookForm from "@/app/components/AddBookForm";

export const metadata = {
  title: "Add a Book | BookNook",
  description:
    "Add a new book to the BookNook shelf. Share a cover, a story, and a few copies with your next reader.",
};

export default function AddBookPage() {
  return <AddBookForm />;
}
