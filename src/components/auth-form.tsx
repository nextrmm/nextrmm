"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { authDataSchema } from "~/lib/validation/auth";
import { I18nDict } from "~/types";
import { AuthFormType } from "~/types/index.d";

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  authFormType: AuthFormType;
  locale: string;
  d: I18nDict;
}

type AuthFormData = z.infer<typeof authDataSchema>;

export function AuthForm({
  className,
  authFormType,
  locale,
  d,
  ...props
}: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [lastSent, setLastSent] = React.useState<number>(0);
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authDataSchema),
  });

  async function onSubmit(data: AuthFormData) {
    const now = Date.now();
    if (now - lastSent < 60000) {
      toast({
        variant: "destructive",
        title: d["email-send-frquent-title"],
        description: d["email-send-frquent-description"],
      });
      return;
    }

    setIsLoading(true);
    const result = await signIn("email", {
      email: `${data.email}`,
      redirect: false,
      callbackUrl: searchParams.get("from") || "/",
    });
    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: d["email-send-error-title"],
        description: d["email-send-error-description"],
      });
    } else {
      setLastSent(now);
      toast({
        title: d["email-send-delivered-title"],
        description: d["email-send-delivered-description"],
      });
    }
    return;
  }

  return (
    <div className={cn("grid gap-9", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label className="sr-only" htmlFor="email">
              {d.email}
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {authFormType === AuthFormType.SignIn ? d["sign-in"] : d["sign-up"]}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {d.continue}
          </span>
        </div>
      </div>
      <div className="grid gap-6">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <Icons.google className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </div>
    </div>
  );
}
