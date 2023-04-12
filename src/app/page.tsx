'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';

import logo from '@/assets/logo.png';

const CLIENT_ID: string = 'ef5ac96b94f24163ad7a085421f4427c';
const CLIENT_SECRET: string = 'a93ee2c123df45639e7a7902e38a8d68';

export default function Home(): any {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const { push } = useRouter();

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
    // get request using the search to get the artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    };
    const artistID = await fetch(
      'https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',
      searchParameters
    )
      .then(async (res) => res.json())
      .then((data) => {
        console.log(data);
        return data.artists.items[0].id;
      });

    console.log('Artist ID: ' + artistID);
    // get request with the artist ID grab all the albuns from that artist
    const albums = await fetch(
      'https://api.spotify.com/v1/artists/' +
        artistID +
        '/albums' +
        '?include_type=album&limit=50',
      searchParameters
    )
      .then(async (res) => res.json())
      .then((data) => {
        setSearchResult(data.items);
        console.log(data.items.length);
      });
    // get request with the album to get the songs

    /* const tracks = await fetch('https://api.spotify.com/v1/artists/' +
    artistID +
    '/albums' +) */

    // Display albuns to user
    console.log(searchResult);
  }
  const albumID = (id: string) => {
    push(`/${id}`);
    console.log(id);
  };

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
          <button
            className="searchIconContainer"
            onClick={Search}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                Search();
              }
            }}
          >
            <FaSearch className="searchIcon" />
          </button>
        </section>
      </header>
      <div className="cardGrid">
        {searchResult.map((album: any, i: any) => {
          return (
            <div
              className="cardContainer"
              key={album.uri}
              onClick={() => albumID(album.uri)}
            >
              <img className="cardImage" src={album.images[0].url} alt="" />
              <div className="cardBody">
                <h2 className="cardTitle">{album.name}</h2>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
