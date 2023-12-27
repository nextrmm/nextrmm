import Link from "next/link";
import { SignUpForm } from "~/components/signup-form";
import type { Locale } from "~/i18n-config";
import { getDictionary } from "~/lib/dictionary";
import { AuthFormType } from "~/types/index.d";

type Props = {
  params: { locale: Locale };
};

export default async function RegisterPage({ params: { locale } }: Props) {
  const d = await getDictionary(locale);

  return (
    <>
      <div className="container flex h-full min-h-screen w-full flex-col items-center justify-center">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-9 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {d.register["create-account"]}
              </h1>
            </div>
            <SignUpForm d={d["sign-up-form"]} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="hover:text-brand underline underline-offset-4"
              >
                {d.register["sign-in"]}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
