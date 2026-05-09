import Image from "next/image";
import Link from "next/link";
import { copy } from "@/constants/copy";
import * as styles from "./Header.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logoLink} href="/" aria-label={copy.brand.name}>
          <Image
            className={styles.logo}
            src="/ecofont-logo.svg"
            alt={copy.brand.name}
            width={220}
            height={52}
            priority
          />
        </Link>
      </div>
    </header>
  );
}
