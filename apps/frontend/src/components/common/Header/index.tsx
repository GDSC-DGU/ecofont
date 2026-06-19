import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import * as styles from "./Header.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logoLink} href="/" aria-label="ecofont">
          <Logo />
        </Link>
      </div>
    </header>
  );
}
