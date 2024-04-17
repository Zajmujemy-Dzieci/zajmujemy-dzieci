import React from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
    return (
        <React.Fragment>
            <Head>
                <title>Home - Nextron (with-tailwindcss)</title>
            </Head>
            <div className="grid grid-col-1 p-5 text-2xl w-full text-center">
                <div className="p-5">
                    <Image
                        className="ml-auto mr-auto"
                        src="/images/logo.png"
                        alt="Logo image"
                        width="256px"
                        height="256px"
                    />
                </div>
                <div className="p-5 text-4xl" style={{ fontSize: '3rem' }}>
                    Witaj w Nextron!
                    <div className="my-5 text-2xl" style={{ fontSize: '2rem' }}>
                        Zmień lekcje w przygodę - nauczaj poprzez zabawę!
                    </div>
                </div>
            </div>
            <div className="mt-5 w-full flex-wrap flex justify-center">
                <Link href="/loader">
                    <a className="btn-blue" style={{ padding: '10px 20px', fontSize: '1.5rem' }}>Rozpocznij przygodę!</a>
                </Link>
            </div>
        </React.Fragment>
    );
}
