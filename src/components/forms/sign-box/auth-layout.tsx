import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/features/supplier/components/brand-logo";
import styles from "./auth.module.css";

export function AuthLayout({
  titleId,
  eyebrow,
  title,
  description,
  storyTitle = (
    <>
      Seu próximo
      <br />
      destino começa
      <br />
      aqui.
    </>
  ),
  storyDescription = "Descubra passeios, viva novas experiências e leve boas histórias com você.",
  children,
}: {
  titleId: string;
  eyebrow: string;
  title: string;
  description: string;
  storyTitle?: ReactNode;
  storyDescription?: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.page} data-theme="light">
      <div className={styles.card}>
        <section className={styles.story} aria-label="Conheça seu destino">
          <Link href="/" className={styles.brand}>
            <BrandLogo light className={styles.storyLogo} />
          </Link>
          <div className={styles.storyContent}>
            <p className={styles.storyTag}>CADA VIAGEM, UMA NOVA HISTÓRIA</p>
            <h2>{storyTitle}</h2>
            <p>{storyDescription}</p>
          </div>
          <p className={styles.storyFooter}>
            Conheça lugares. Colecione momentos.
          </p>
        </section>
        <section className={styles.content} aria-labelledby={titleId}>
          <div className={styles.topbar}>
            <Link href="/" className={styles.mobileBrand}>
              <BrandLogo />
            </Link>
            <Link href="/" className={styles.backLink}>
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar ao site
            </Link>
          </div>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>{eyebrow}</p>
            <h1 id={titleId}>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
        </section>
      </div>
      <p className={styles.footer}>
        Conheça seu destino · Sua próxima história começa aqui.
      </p>
    </main>
  );
}
