'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import SpotifyPlayer from 'react-spotify-web-playback';

import logo from '@/assets/logo.png';

const CLIENT_ID: string = 'ef5ac96b94f24163ad7a085421f4427c';
const CLIENT_SECRET: string = 'a93ee2c123df45639e7a7902e38a8d68';

export default function Home(): any {
  const [searchScreen, setSearchScreen] = useState(false);
  const [modalTracks, setModalTracks] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albumImage, setAlbumImage] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [tracksResult, setTracksResult] = useState([]);
  const [playingTrack, setPlayingTrack] = useState('');
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
        setSearchScreen(true);
      });
    // get request with the album to get the songs

    /* const tracks = await fetch('https://api.spotify.com/v1/artists/' +
    artistID +
    '/albums' +) */

    // Display albuns to user
    console.log(searchResult);
  }
  async function getAlbumID(albumId: string, artistId: string) {
    const albumID = albumId;
    const artistID = artistId;
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken
      }
    };
    const albums = await fetch(
      'https://api.spotify.com/v1/albums/' + albumID,
      searchParameters
    )
      .then(async (res) => res.json())
      .then((data) => {
        setAlbumImage(data.images[0].url);
      });
    const tracks = await fetch(
      'https://api.spotify.com/v1/albums/' + albumID + '/tracks',
      searchParameters
    )
      .then(async (res) => res.json())
      .then((data) => {
        setModalTracks(true);
        setTracksResult(data.items);
      });
  }

  function ResetAll() {
    setSearchScreen(false);
  }

  return (
    <main>
      <header>
        <Image
          className="logoImage"
          src={logo}
          alt="Logo image"
          onClick={ResetAll}
        />
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
        {searchScreen
          ? searchResult.map((album: any, i: any) => {
              return (
                <div
                  className="cardContainer"
                  key={album.uri}
                  onClick={async () =>
                    getAlbumID(album.id, album.artists[0].id)
                  }
                >
                  <img className="cardImage" src={album.images[0].url} alt="" />
                  <div className="cardBody">
                    <h2 className="cardTitle">{album.name}</h2>
                  </div>
                </div>
              );
            })
          : null}
        {modalTracks ? (
          <div className="modalContainer">
            <FaTimes
              className="closeModal"
              onClick={() => setModalTracks(false)}
            />
            <div className="modalBody">
              <div className="albumImageContainer">
                <img className="albumImage" src={albumImage} alt="" />
              </div>
              <div className="tracksDiv">
                {tracksResult.map((track: any, i: any) => {
                  const musicDurationMin = track.duration_ms / 60000;

                  return (
                    <div key={track.id} className="trackContainer">
                      <p className="trackArtistName">{track.artists[0].name}</p>
                      <p className="trackName">{track.name}</p>
                      <p className="trackTime">
                        {musicDurationMin.toFixed(2).replace('.', ':')}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
