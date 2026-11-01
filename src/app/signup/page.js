import AuthForm from "@/app/components/AuthForm";

export const metadata = {
  title: "Sign Up | BookNook",
  description:
    "Create a free BookNook account to build your personal shelf and share books with readers.",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
