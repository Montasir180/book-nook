import AuthForm from "@/app/components/AuthForm";

export const metadata = {
  title: "Sign In | BookNook",
  description:
    "Sign in to BookNook to revisit your shelf, track your borrows, and discover your next read.",
};

export default function LoginPage() {
  return <AuthForm mode="signin" />;
}
