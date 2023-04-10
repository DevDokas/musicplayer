'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import logo from '@/assets/logo.png';

const CLIENT_ID: string = 'ef5ac96b94f24163ad7a085421f4427c';
const CLIENT_SECRET: string = 'a93ee2c123df45639e7a7902e38a8d68';

export default function Home(): any {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    // API Access token
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body:
        'grant_type=client_credentials&client_id=' +
        CLIENT_ID +
        '&client_secret=' +
        CLIENT_SECRET
    };
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(async (result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function Search() {
    console.log(searchInput);
  }

  return (
    <main>
      <header>
        <Link href="/">
          <Image className="logoImage" src={logo} alt="Logo image" />
        </Link>
        <section className="containerSearch">
          <input
            type="search"
            className="searchInput"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                Search();
              }
            }}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <div className="searchIconContainer">
            <FaSearch className="searchIcon" onClick={Search} />
          </div>
        </section>
      </header>
      <Link href="/about">About</Link>
      <br />
      {searchInput}
    </main>
  );
}
