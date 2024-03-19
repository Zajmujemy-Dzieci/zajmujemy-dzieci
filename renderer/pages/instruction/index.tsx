import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { VerySpecialButton } from "./VerySpecialButton";
import styles from "./InstructionPage.module.scss";

export default function InstructionPage() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-tailwindcss)</title>
      </Head>
      <div className={styles.veryUniqueDiv}>
        <h1 className="veryUniqueDivandH1">Instruction</h1>
        <p>Instruction content</p>
        <VerySpecialButton />
      </div>
    </React.Fragment>
  );
}
