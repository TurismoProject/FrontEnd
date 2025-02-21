"use client";

import Link from "next/link";
import { getUserBasicInfo, loginUser } from "@/app/actions";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { safeAsync } from "@/lib/utils";

export default function LoginForm() {
  const { setJWTAccessToken, setUserData } = useAuth();
  const router = useRouter();

  async function handleAction(formData: FormData) {
    const [loginError, response] = await safeAsync(loginUser(formData));

    if (loginError) {
      console.log(loginError);
      return;
    }

    if (!setJWTAccessToken || !setUserData) return;

    const [err, userData] = await safeAsync(
      getUserBasicInfo(response.accessToken)
    );

    if (err) {
      console.log(err);
      return;
    }

    const name = userData?.name || "";
    setJWTAccessToken(response.accessToken);
    setUserData({
      name: name,
      email: formData.get("email") as string,
    });

    // TODO: Redirect to the page the user was in before
    // logging in.
    router.push("/");
  }

  return (
    <form className="space-y-6" action={handleAction}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Endereço de e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-100 text-gray-900 bg-white focus:outline-none focus:ring-gray-700 focus:border-gray-700 sm:text-sm"
            placeholder=""
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-100 text-gray-900 bg-white focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            placeholder=""
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <Link
            href="/login/esqueci"
            className="font-medium text-gray-500 hover:text-gray-400"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Login
        </button>
      </div>
    </form>
  );
}
