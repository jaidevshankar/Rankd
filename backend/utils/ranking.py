import os
from http.client import HTTPException
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi import HTTPException
from supabase import create_client, Client
from dotenv import load_dotenv


# Initialize .env
load_dotenv(dotenv_path="../.env")

# Initialize Supabase
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

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

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

yelp_api_key = "ucZ-Ad_-RlW5rWrFLkUEo26NwPXJer4-8x5D-kwrJXYk8IOWseuNMiofbR0_YgpPBhzcDTa4GR4a6B9-xUyKPkmAsr6-xQALz73qxmeNSTIgVd0V2W1KZ7y760t7Z3Yx"
def fetch_restaurant_data(restaurant_id: str):
    url = f"https://api.yelp.com/v3/businesses/{restaurant_id}"
    headers = {
        "Authorization": f"Bearer {yelp_api_key}"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        restaurant = response.json()
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
            
        return {
            "item_id": restaurant["id"],
            "item_name": restaurant["name"],
            "metadata": {
                "rating": restaurant.get("rating"),
                "price": restaurant.get("price", "N/A"),
                "categories": [category["title"] for category in restaurant.get("categories", [])],
                "location": {
                    "address": restaurant.get("location", {}).get("address1"),
                    "city": restaurant.get("location", {}).get("city"),
                    "state": restaurant.get("location", {}).get("state"),
                    "zip_code": restaurant.get("location", {}).get("zip_code")
                }
            }
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching restaurant data: {str(e)}")
    except (KeyError, TypeError, IndexError) as e:
        raise HTTPException(status_code=400, detail=f"Error parsing restaurant data: {str(e)}")

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

TOKEN_URL = "https://id.twitch.tv/oauth2/token"
CLIENT_ID = "kyims1uluvn3gbsfb5su8uvso8jjyw"
CLIENT_SECRET = "mqnigbgfjiqa9clj0h8nef6dm7d8qq"
def get_access_token():
    """
    Fetch a new access token from the IGDB API.
    """
    params = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    }
    
    try:
        response = requests.post(TOKEN_URL, params=params)
        response.raise_for_status()
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching access token: {str(e)}")

def fetch_game_data(game_id: str):
    """
    Fetch game data from the IGDB API.
    
    :param game_id: ID of the game to fetch
    :return: Dictionary containing game information
    """
    access_token = get_access_token()
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {access_token}"
    }
    
    # Request specific fields we need
    body = "fields id,name,first_release_date,genres.name,platforms.name;"
    body += f" where id = {game_id};"
    
    try:
        response = requests.post(url, headers=headers, data=body)
        response.raise_for_status()
        
        game_data = response.json()
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
            
        game = game_data[0]  # Get first (and should be only) game
        
        # Safely get genres and platforms
        genres = game.get("genres", [])
        platforms = game.get("platforms", [])
        
        return {
            "item_id": game["id"],
            "item_name": game["name"],
            "metadata": {
                "release_date": game.get("first_release_date", None),
                "genres": [genre["name"] for genre in genres] if genres else [],
                "platforms": [platform["name"] for platform in platforms] if platforms else []
            }
        }
        
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error fetching game data: {str(e)}")
    except (KeyError, TypeError, IndexError) as e:
        raise HTTPException(status_code=400, detail=f"Error parsing game data: {str(e)}")

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

