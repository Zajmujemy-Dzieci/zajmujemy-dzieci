import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import QRCode from 'qrcode.react'
import axios from 'axios'


export default function QRcodePage() {
    const [ipAddress, setIPAddress] = useState<string>('192.168.137.1');

    useEffect(() => {
        axios.get<string>('http://localhost:3000/ipaddress')
        .then(response => {
            setIPAddress(response.data);
        })
        .catch(error => {
            console.error('Błąd pobierania danych:', error);
        });
    }, []); 
       
    return (
        <React.Fragment>
        <Head>
            <title>Join do game!</title>
        </Head>
        <div className="flex justify-center text-4xl flex-col items-center m-10" >
            <p>Adres do połączenia się: {ipAddress}:3000</p>
            <div className="m-10">
                <QRCode value={`${ipAddress}:3000`}
                    className='m-10' size={400}/>  
            </div>

            <Link href="/next">
                <a className="btn-blue">Przejdź dalej</a>
            </Link>                 
            <Link href="/hotspot_instruction_page">
                <a className="btn-blue m-5">Instrukcja włączenia hotspota</a>
            </Link>                 
        </div>
        </React.Fragment>
    )
} 