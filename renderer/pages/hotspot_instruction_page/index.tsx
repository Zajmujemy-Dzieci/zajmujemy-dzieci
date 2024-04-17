import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'


export default function hotspotPage() {
    return (
        <React.Fragment>
        <Head>
            <title>Turn on Hostpot instructiont</title>
        </Head>
        <div className="flex min-w-full flex-col text-4xl" >
            <div className='flex'>

                <div className="m-10">
                    <li>Klikamy przycisk Windows znajdujący się w lewym dolnym rogu ekranu</li>
                    <li>Wyszukujemy "Hotspot"</li>
                    <li>Następnie w zakładce "Hotspot mobilny" klikamy "Włącz"</li>
                    <li>W zakładce "Właściwości" jest podana nazwa sieci oraz hasło do niej</li>
                </div>
            </div>
        </div>
        <div className="mt-1 w-full flex-wrap flex justify-center text-4xl">
            <Link href="/QRcode_page">
            <a className="btn-blue">Powrót do QR</a>
            </Link>
        </div>
        </React.Fragment>
    )
}