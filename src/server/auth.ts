import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from "resend";
import { UAParser } from "ua-parser-js";
import { NewLocationTemplate } from "~/components/email-template/new_location";
import { SignInTemplate } from "~/components/email-template/sign-in";
import { SignUpTemplate } from "~/components/email-template/sign-up";
import { env } from "~/env.mjs";
import type { Locale } from "~/i18n-config";
import { getDictionary } from "~/lib/dictionary";
import { authDataSchema } from "~/lib/validation/auth";
import { db } from "~/server/db";

// const resend = new Resend("re_T3T2Nw76_LrnEcTmQxUC3oXfdAJ92WQmM");
const resend = new Resend("re_XX3MKJqY_DkUDc3KveWnWQQD124TfAhWP");

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string; // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

function os_modify(package_get_os: string): string {
  const database_os_replace: {
    [key: string]: string;
  } = {
    "Mac OS": "MacOS",
    iOS: "IOS",
  };
  // 修改os的值
  let upper_os = database_os_replace[package_get_os] ?? package_get_os;
  const database_os_list = [
    "Windows",
    "Linux",
    "MacOS",
    "Android",
    "IOS",
    "Other",
  ];
  //匹配os的值
  if (!database_os_list.includes(upper_os)) {
    upper_os = "Other";
  }

  return upper_os;
}

function un2str(value: string | undefined | null): string {
  if (value === undefined || value === null) {
    return "";
  } else {
    return value;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
async function createLoginSession(
  user: any,
  user_agent: string,
  user_ip: string,
  session_id: string,
) {
  const os = os_modify(un2str(new UAParser(user_agent).getOS()["name"]));
  const ipapi_res = await fetch(`http://ipapi.co/${user_ip}/json/`);
  const ipapi_json = await ipapi_res.json();
  let country_name = "other";
  let region = "other";
  let city = "other";
  if (ipapi_json["error"] === undefined) {
    country_name = ipapi_json["country_name"];
    region = ipapi_json["region"];
    city = ipapi_json["city"];
  }
  return await db.loginSession.create({
    data: {
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { connect: { id: user.id } },
      session: { connect: { id: session_id } },
      ip: user_ip,
      userAgent: user_agent,
      os: os,
      country: country_name,
      region: region,
      city: city,
      browser: un2str(new UAParser(user_agent).getBrowser()["name"]),
    },
  });
}

async function getLoginSession(sessionId: string) {
  return await db.loginSession.findFirst({
    where: {
      session: {
        id: sessionId,
      },
    },
  });
}

export function authOptions(
  user_agent?: string,
  user_ip?: string,
): NextAuthOptions {
  return {
    callbacks: {
      async session({ session, user }: { session: any; user: any }) {
        if (session.expires === undefined || user_agent === undefined) {
          return {
            ...session,
            user: {
              ...session.user,
              id: user.id,
            },
          };
        }

        let token_expires = session.expires;
        let session_model = await db.session.findFirst({
          where: {
            user: {
              id: user.id,
            },
            expires: token_expires,
          },
        });

        let login_session = null;
        if (session_model !== null) {
          login_session = await getLoginSession(session_model.id);
        }

        if (login_session === null && session_model !== null) {
          user_ip = user_ip === undefined ? "" : user_ip;
          try {
            login_session = await createLoginSession(
              user,
              user_agent,
              user_ip,
              session_model.id,
            );
            // 查询city是否在user的login_session中出现过，没出现过则发送邮件
            let login_session_count = await db.loginSession.count({
              where: {
                user: {
                  id: user.id,
                },
                city: login_session.city,
              },
            });
            if (login_session_count === 1) {
              const provider_from = env.EMAIL_FROM;
              const user_email = user.email.split("+")[0];
              const { createdAt, ip, userAgent, os, browser, city, country } =
                login_session;
              console.log("send email to ", user_email);
              await resend.emails.send({
                from: provider_from,
                to: un2str(user_email),
                subject: `New location login notification.`,
                react: NewLocationTemplate({
                  username: user_email,
                  account: user_email,
                  time: createdAt.toLocaleString(),
                  ip: ip,
                  city: city,
                  country: country,
                  os: os,
                  browser: browser,
                }),
              });
            }
          } catch (e) {
            console.log("create new location error: ", e);
          }
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        };
      },
    },
    pages: {
      signIn: "/login",
    },
    adapter: PrismaAdapter(db),
    providers: [
      // DiscordProvider({
      //   clientId: env.DISCORD_CLIENT_ID,
      //   clientSecret: env.DISCORD_CLIENT_SECRET,
      // }),
      EmailProvider({
        server: {
          host: env.EMAIL_SERVER_HOST,
          port: env.EMAIL_SERVER_PORT,
          auth: {
            user: env.EMAIL_SERVER_USER,
            pass: env.EMAIL_SERVER_PASSWORD,
          },
        },
        from: env.EMAIL_FROM,
        sendVerificationRequest: async ({ identifier, url, provider }) => {
          try {
            const { host } = new URL(url);
            const splits = identifier.split("+");
            const email = splits[0];
            const locale = splits[1] ?? "en";

            // Email provider lowercase all the letters so we need to transform it back for locales like "es-ES"
            const transformedLocale = locale
              .split("-")
              .map((part, index) => (index > 0 ? part.toUpperCase() : part))
              .join("-");

            const isEmailValid = authDataSchema.safeParse({ email });

            if (!isEmailValid.success) {
              throw new Error("Invalid Email.");
            }

            const user = await db.user.findUnique({
              where: {
                email: isEmailValid.data.email,
              },
              select: {
                emailVerified: true,
              },
            });

            const dictionary = await getDictionary(transformedLocale as Locale);
            const signInDictionary = dictionary["sign-in-email-template"];
            const signUpDictionary = dictionary["sign-up-email-template"];

            console.log("login_url\n", url);
            let email_send_response = await resend.emails.send({
              from: provider.from,
              to: isEmailValid.data.email,
              subject: `Sign in to ${host}.`,
              text: `Sign in to ${host}\n${url}\n\n`,
              react: user
                ? SignInTemplate({ host, url, d: signInDictionary })
                : SignUpTemplate({
                    host,
                    url,
                    d: signUpDictionary,
                  }),
            });
          } catch (error) {
            throw new Error(`Email could not be sent.`);
          }
        },
      }),
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      }) /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */,
    ],
  };
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (user_agent?: string, user_ip?: string) =>
  getServerSession(authOptions(user_agent, user_ip));
