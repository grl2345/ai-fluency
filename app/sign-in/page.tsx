import { SignInCard } from "@/components/auth-ui";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const redirectTo = next?.startsWith("/") ? next : "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white px-5 py-12">
      <SignInCard next={redirectTo} />
    </main>
  );
}
