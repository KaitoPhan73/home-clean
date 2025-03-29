import { Metadata } from "next";
import SignInViewPage from "../_components/sigin-view";

export const metadata: Metadata = {
  title: "Login Page | HomePlus",
  description: "Sign In page for Authentication.",
};

export default function Page() {
  return (
    <div>
      <SignInViewPage />;
    </div>
  );
}
