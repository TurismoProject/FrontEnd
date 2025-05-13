"use client";

import Link from "next/link";
import { getUserBasicInfo, loginSupplier, loginUser } from "@/app/actions";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { safeAsync } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";

export default function LoginForm({
  type,
}: {
  type: "loginUser" | "loginSupplier";
}) {
  const { setJWTAccessToken, setUserData } = useAuth();
  const router = useRouter();

  async function handleAction(formData: FormData) {
    const [loginError, response] =
      type === "loginUser"
        ? await safeAsync(loginUser(formData))
        : await safeAsync(loginSupplier(formData));

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
        <div className="relative w-sm">
          <TextField
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            label="Endereço de e-mail"
            required
            className="w-full"
            placeholder=""
          />
        </div>
        <div className="relative w-sm">
          <TextField
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            label="Senha"
            required
            className="w-full"
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
        <Button
          type="submit"
          size="xl"
          className="w-full flex justify-center py-2 px-4 border border-transparent text-xl font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Login
        </Button>
      </div>
    </form>
  );
}
