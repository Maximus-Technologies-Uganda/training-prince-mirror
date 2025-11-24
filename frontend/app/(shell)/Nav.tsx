"use client";

import React from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import styles from "./nav.module.css";

const links: Array<{ href: Route; label: string }> = [
  { href: "/expenses", label: "Expenses" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.logo}>Day 2 Ledger</div>
      <ul className={styles.links}>
        {links.map((link) => {
          const isActive = pathname?.startsWith(link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={isActive ? styles.activeLink : styles.link}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
