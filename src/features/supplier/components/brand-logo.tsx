import Image from "next/image";
import logoBlack from "@/../public/logohorizontalpreto.png";
import logoWhite from "@/../public/logohorizontalbranco.png";
import styles from "../supplier.module.css";

/** Reutiliza a marca oficial nas superfícies claras e escuras da área do fornecedor. */
export function BrandLogo({
  light = false,
  className = "",
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <span className={`${styles.brandLogo} ${className}`}>
      <Image
        src={light ? logoWhite : logoBlack}
        alt="Conheça seu destino"
        className={styles.brandImage}
        sizes="250px"
        priority
      />
    </span>
  );
}
