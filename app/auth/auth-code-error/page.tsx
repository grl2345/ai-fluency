import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Sign-in failed</h1>
      <p className="max-w-md text-slate-600">
        Google or GitHub authorization did not complete. Check your Supabase and OAuth provider callback settings.
      </p>
      <Link
        href="/sign-in"
        className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Try signing in again
      </Link>
    </main>
  );
}
