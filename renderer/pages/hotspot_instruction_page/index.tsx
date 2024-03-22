import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from 'qrcode.react'


export default function NextPage() {
    const electron = (window as any).electron;
    const ipAddress :string = electron.netInterfaces();
    return (
        <React.Fragment>
        <Head>
            <title>Turn on Hostpot instructiont</title>
        </Head>
        <div className="flex h-screen min-w-full flex-col  text-4xl" >
            <div className='flex'>
                <div className="m-10">
                    Dla użytkowników MacOs:
                    <li>Klikamy w ikonę apple</li>
                    <li>Wybieramy 'Ustawienia systemowe'</li>
                    <li>Kliknij w 'ogólne' na pasku bocznym</li>
                    <li>kliknij w 'Udostępnianie' po prawej</li>
                    <li>Włącz Udostępnianie Internetu, a następnie kliknij we Włącz, aby potwierdzić.</li>

                </div>
                <div className="m-10">
                    Dla użytkowników windowsa:
                    <li>Klikamy przycisk windows</li>
                    <li>Wyszukujemy 'hotspot'</li>
                    <li>Następnie klikamy w zakładce hotspot mobilny: włącz</li>
                    <li>W zakładce właściwości jest podana nazwa sieci oraz hasło do niej</li>
                </div>

                <div className="m-10">
                    <p>Adres do polaczenia sie:http://{ipAddress}:3000</p>
                    <a href={`http://${ipAddress}:3000`}>
                    <QRCode value={`http://${ipAddress}:3000`}/>
                    
                    </a>
                    <Link href="/next">
                    
                    <a className="btn-blue">Return</a>                    
                    </Link>
                </div>
                

            </div>
        </div>
        </React.Fragment>
    )
}