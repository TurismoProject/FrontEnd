import Image from "next/image";

export function GoogleLoginLink() {
  return (
    <p className="text-center text-sm text-gray-700 rounded-sm flex items-center justify-center gap-2">
      <span>Faça o seu login com o</span>
      <a href="/api/auth/google" className="flex items-center gap-1">
        <Image src="/google.png" alt="" width={20} height={20} />
        Google
      </a>
    </p>
  );
}
