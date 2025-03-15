import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from fastapi import HTTPException

# Initialize the Spotify client with credentials
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="30b50adac3584635a327735395823eb7",
    client_secret="7471275b93e44c929743e06936760cc5"
))

def fetch_album(album_id: str):
    album_data = sp.album(album_id)
    return {
        "item_id": album_data["id"],
        "item_name": album_data["name"],
        "metadata": {
            "artist": album_data["artists"][0]["name"],
            "release_date": album_data["release_date"],
            "tracks": [track["name"] for track in album_data["tracks"]["items"]]
        }
    }


TMDB_API_KEY = "213e8f28caae25b3b4cc495a11db1272"

def fetch_movie(movie_id: str):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid movie ID")
    movie_data = response.json()
    return {
        "item_id": movie_data["id"],
        "item_name": movie_data["title"],
        "metadata": {
            "release_date": movie_data["release_date"],
            "genres": [genre["name"] for genre in movie_data["genres"]]
        }
    }

def fetch_tv(tv_id: str):
    url = f"https://api.themoviedb.org/3/tv/{tv_id}"
    params = {"api_key": TMDB_API_KEY}
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid TV ID")
    tv_data = response.json()
    return {
        "item_id": tv_data["id"],
        "item_name": tv_data["name"],
        "metadata": {
            "release_date": tv_data["first_air_date"],
            "genres": [genre["name"] for genre in tv_data["genres"]]
        }
    }

GOOGLE_API_KEY = "AIzaSyCiBmNOrvLUCDq-7h_7Wn1td4OKeQGntbs"
GOOGLE_API_LINK = "https://www.googleapis.com/books/v1"

def fetch_book(book_id: str):
    url = f"{GOOGLE_API_LINK}/volumes/{book_id}?key={GOOGLE_API_KEY}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid book ID")
    book_data = response.json()
    return {
        "item_id": book_data["id"],
        "item_name": book_data["volumeInfo"]["title"],  
        "metadata": {
            "authors": book_data["volumeInfo"]["authors"],
            "publisher": book_data["volumeInfo"]["publisher"],
            "published_date": book_data["volumeInfo"]["publishedDate"],
            "description": book_data["volumeInfo"]["description"]
        }
    }