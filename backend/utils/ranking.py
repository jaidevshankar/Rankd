from typing import List, Dict
from fastapi import FastAPI, HTTPException, Query, Body
from pydantic import BaseModel
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import scipy.stats
from supabase import create_client, Client
import requests
from balldontlie import BalldontlieAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
How to run:
1. Install all libraries and uvicorn

2. Download Postman

3. cd into the backend folder

4. Run the following command in terminal: uvicorn ranking:app --reload. If it doesn't work, ask ChatGPT and give it your complete file path

5. Once you've ran the command, go to Postman and run an HTTP request

6. Go to body and select raw and JSON

7. Make a POST request to the following address: http://127.0.0.1:8000/compare. It might be different on your device but it will say in the terminal output what address to send your request to

Music:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "6pOiDiuDQqrmo5DbG0ZubR",
    "topic_name": "Albums"
    }

   Change the "item_id" region to whatever valid spotify album id you want to add. You can find spotify album ids by looking up the album on google, going to spotify and looking at the last section of the URL. 

   For example, this is how you find the album id for Blonde by Frank Ocean:

   URL: https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf
   Album id: 3mH6qwIy9crq0I9YQbOuDf

Movies:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "27205",
    "topic_name": "Movies"
    }

    Change the "item_id" region to whatever valid TMDB movie id you want to add. You can find TMDB movie ids by looking up the movie on google, going to TMDB and looking at the numerical section of the URL.

    For example, this is how you find the movie id for The Godfather by Francis Ford Coppola:

    URL: https://www.themoviedb.org/movie/238-the-godfather?language=en-US
    Movie id: 238

TV Shows:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "60625",
    "topic_name": "TV Shows"
    }

    Change the "item_id" region to whatever valid TMDB TV show id you want to add. You can find TMDB TV show ids by looking up the TV show on google, going to TMDB and looking at the numerical section of the URL.

    For example, this is how you find the TV show id for House MD by Greg Daniels:

    URL: https://www.themoviedb.org/tv/1408-house?language=en-US
    TV show id: 1408

Books:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "nrRKDwAAQBAJ",
    "topic_name": "Books"
    }

    Change the "item_id" region to whatever valid Google Books id you want to add. You can find Google Books ids by looking up the book on google, going to Google Books and looking at the last section of the URL.

    For example, this is how you find the book id for Dune by Frank Herbert:

    URL: https://books.google.com/books/about/Dune.html?id=nrRKDwAAQBAJ
    Book id: nrRKDwAAQBAJ


Video Games:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "37016",
    "topic_name": "Video Games"
    }

    Change the "item_id" region to whatever valid IGDB game id you want to add. You can find IGDB game ids by looking up the game on IGDB, and scrolling down to the section where it says IGDB ID.

    For example, this is how you find the game id for The Witcher 3 by CD Projekt Red:

    URL: https://www.igdb.com/games/the-witcher-3-wild-hunt
    Game id: 1942


Restaurants:
8. In the body of the request use this format:

    {
    "user_id": "test_user",
    "item_id": "subway-des-plaines-14",
    "topic_name": "Restaurants"
    }

    Change the "item_id" region to whatever valid Yelp restaurant id you want to add. You can find Yelp restaurant ids by looking up the restaurant on google, going to Yelp and looking at the section after the biz/ in the URL.

    For example, this is how you find the restaurant id for Noodles & Company:

    URL: https://www.yelp.com/biz/noodles-and-company-glenview?osq=noodles+and+company
    Restaurant id: noodles-and-company-glenview?osq=noodles+and+company

9. Click send on the POST request then go to your terminal and answer the questions prompted to you

10. Once finished, you should see the rankings outputted in Postman
"""

# API keys
TMDB_API_KEY = "213e8f28caae25b3b4cc495a11db1272"
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="30b50adac3584635a327735395823eb7",
    client_secret="7471275b93e44c929743e06936760cc5"
))
GOOGLE_API_KEY = "AIzaSyCiBmNOrvLUCDq-7h_7Wn1td4OKeQGntbs"
GOOGLE_API_LINK = "https://www.googleapis.com/books/v1"
YELP_API_KEY = "ucZ-Ad_-RlW5rWrFLkUEo26NwPXJer4-8x5D-kwrJXYk8IOWseuNMiofbR0_YgpPBhzcDTa4GR4a6B9-xUyKPkmAsr6-xQALz73qxmeNSTIgVd0V2W1KZ7y760t7Z3Yx"
# BALL_API_KEY = "81e81bb2-d3d1-48c0-8d02-3eda37cadf39"
# api = BalldontlieAPI(api_key=BALL_API_KEY)


# Initialize Supabase
url = "https://gkvqpvkyncgblfbfmsoz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdnFwdmt5bmNnYmxmYmZtc296Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk5MTI5NSwiZXhwIjoyMDUwNTY3Mjk1fQ.KPPQgtkdf6tycv7CKe7hYhbKc0wx48mbeIXWAWU3OOs"
supabase: Client = create_client(url, key)

# Generalized request model
class ItemComparisonRequest(BaseModel):
    user_id: int
    item_id: str
    topic_name: str

class ItemRerankRequest(BaseModel):
    user_id: int
    item_id: int
    topic_name: str

class RemoveItemRequest(BaseModel):
    user_id: int
    item_id: int
    topic_name: str

@app.get("/")
def read_rood():
    return {"message": "Hello, world!"}


# API-specific fetch functions
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

# Add other functions for fetching other topic data here

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


def fetch_restaurant_data(restaurant_id: str):
    """
    Fetch restaurant data from the Yelp API.
    
    :param restaurant_id: ID of the restaurant to fetch
    :return: Dictionary containing restaurant information
    """
    url = f"https://api.yelp.com/v3/businesses/{restaurant_id}"
    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
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


# Dispatcher for fetching item data
def fetch_item_data(topic_name: str, item_id: str):
    topic_apis = {
        "Albums": fetch_album,
        "Movies": fetch_movie,
        "TV Shows": fetch_tv,
        "Books": fetch_book,
        "Video Games": fetch_game_data,
        "Restaurants": fetch_restaurant_data
        # Add other topic handlers here
    }

    if topic_name not in topic_apis:
        raise HTTPException(status_code=400, detail=f"Unsupported topic: {topic_name}")


    return topic_apis[topic_name](item_id)

# Fetch rankings in linked list order
def fetch_ranked_items(user_id: int, topic_id: int):
    ranked_items = supabase.table("Rankings").select("*").eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not ranked_items:
        return []

    id_to_ranking = {item["item_id"]: item for item in ranked_items}
    head = next((item for item in ranked_items if item["prev_item"] is None), None)
    if not head:
        return []

    ordered_rankings = []
    current = head
    while current:
        item_data = supabase.table("Items").select("item_name").eq("item_id", current["item_id"]).execute().data
        current["item_name"] = item_data[0]["item_name"] if item_data else f"Item {current['item_id']}"
        ordered_rankings.append(current)
        current = id_to_ranking.get(current["next_item"])

    return ordered_rankings


@app.post("/compare")
def compare_item(request: ItemComparisonRequest):
    user_id = request.user_id
    item_id = request.item_id
    topic_name = request.topic_name

    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]


    try:
        item_data = fetch_item_data(topic_name, item_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    existing_item = supabase.table("Items").select("*").eq("item_name", ["item_name"]).execute().data
    if not existing_item:
        new_item = {
            "topic_id": topic_id,
            "item_name": item_data["item_name"],
            "created_by": user_id
        }
        supabase.table("Items").insert(new_item).execute()
        existing_item = supabase.table("Items").select("*").eq("item_name", item_data["item_name"]).execute().data

    item_info = {
        "id": existing_item[0]["item_id"],
        "name": existing_item[0]["item_name"],
        "score": None
    }

    ranked_items = fetch_ranked_items(user_id, topic_id)

    if not ranked_items:
        new_ranking = {
            "user_id": user_id,
            "topic_id": topic_id,
            "item_id": item_info["id"],
            "prev_item": None,
            "next_item": None,
            "score": None
        }
        supabase.table("Rankings").insert(new_ranking).execute()
        return {"message": "First item added successfully.", "ranking": [item_info]}

    # Augment rankings with item names
    rankings = []
    for rank in ranked_items:
        item = supabase.table("Items").select("item_name").eq("item_id", rank["item_id"]).execute().data
        if item:
            rank["item_name"] = item[0]["item_name"]
        rankings.append(rank)

    # Binary search-like ranking logic
    left, right = 0, len(ranked_items) - 1
    insertion_index = -1

    while left <= right:
        mid = (left + right) // 2
        current_item = rankings[mid]

        print(f"Is the new item '{item_info['name']}' better or worse than '{current_item['item_name']}'?")
        comparison_choice = input("Type 'better' or 'worse': ").strip().lower()

        if comparison_choice == "better":
            right = mid - 1
            insertion_index = mid  # Insert before current
        elif comparison_choice == "worse":
            left = mid + 1
            insertion_index = left  # Insert after current
        else:
            print("Invalid input. Please type 'better' or 'worse'.")

    # Update prev_item and next_item
    prev_item_id = None
    next_item_id = None

    if insertion_index > 0:
        prev_item_id = ranked_items[insertion_index - 1]["item_id"]
    if insertion_index < len(ranked_items):
        next_item_id = ranked_items[insertion_index]["item_id"]

    # Insert new item into Rankings
    new_ranking = {
        "user_id": user_id,
        "topic_id": topic_id,
        "item_id": item_info["id"],
        "prev_item": prev_item_id,
        "next_item": next_item_id,
        "score": None
    }
    supabase.table("Rankings").insert(new_ranking).execute()

    # Update adjacent rankings
    if prev_item_id:
        supabase.table("Rankings").update({"next_item": item_info["id"]}).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": item_info["id"]}).eq("item_id", next_item_id).execute()

    # Distribute scores if there are 10+ items
    distribute_scores_normal_curve(user_id, topic_id)

    updated_rankings = fetch_ranked_items(user_id, topic_id)

    for rank in updated_rankings:
        item = supabase.table("Items").select("item_name").eq("item_id", rank["item_id"]).execute().data
        if item:
            rank["item_name"] = item[0]["item_name"]

    return {"message": "Item ranked successfully.", "ranking": updated_rankings}

def distribute_scores_normal_curve(user_id: int, topic_id: int):
    """Distribute scores on a normal curve for the first 10 items."""
    ranked_items = fetch_ranked_items(user_id, topic_id)

    n = len(ranked_items)
    if n < 10:
        return
    mean = 50
    std_dev = 20

    # Use a normal distribution to assign scores
    for idx, item in enumerate(ranked_items):
        # Calculate percentile rank (0 to 1)
        percentile = (n - idx - 1) / (n - 1) if n > 1 else 0.5  # Reverse the percentile for correct ordering
        # Get z-score from percentile
        z_score = scipy.stats.norm.ppf(percentile)
        # Map z-score to score range [0, 100]
        score = min(100, max(0, mean + z_score * std_dev))
        # Insert score into the table
        supabase.table("Rankings").update({"score": score}).eq("ranking_id", item["ranking_id"]).execute()

@app.post("/rerank")
def rerank_item(request: ItemRerankRequest):
    user_id = request.user_id
    item_id = request.item_id
    item_name = supabase.table("Items").select("*").eq("item_id", item_id).execute().data[0]["item_name"]
    topic_name = request.topic_name

    # Fetch topic ID
    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    # Remove the item from current rankings
    current_ranking = supabase.table("Rankings").select("*").eq("item_id", item_id).eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not current_ranking:
        raise HTTPException(status_code=404, detail="Item not found in rankings")

    current_ranking = current_ranking[0]
    prev_item_id = current_ranking["prev_item"]
    next_item_id = current_ranking["next_item"]

    # Update adjacent rankings
    if prev_item_id:
        supabase.table("Rankings").update({"next_item": next_item_id}).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": prev_item_id}).eq("item_id", next_item_id).execute()

    # Delete the current ranking
    supabase.table("Rankings").delete().eq("item_id", item_id).execute()

    # Reinsert the item using compare logic
    ranked_items = fetch_ranked_items(user_id, topic_id)
    if not ranked_items:
        new_ranking = {
            "user_id": user_id,
            "topic_id": topic_id,
            "item_id": item_id,
            "prev_item": None,
            "next_item": None,
            "score": None
        }
        supabase.table("Rankings").insert(new_ranking).execute()
        return {"message": "Item reranked successfully as the first item.", "ranking": [item_id]}
    
    # Augment rankings with item names
    rankings = []
    for rank in ranked_items:
        item = supabase.table("Items").select("item_name").eq("item_id", rank["item_id"]).execute().data
        if item:
            rank["item_name"] = item[0]["item_name"]
        rankings.append(rank)

    # Binary search-like comparison logic
    left, right = 0, len(ranked_items) - 1
    insertion_index = -1

    while left <= right:
        mid = (left + right) // 2
        current_item = rankings[mid]

        print(f"Is the item '{item_name}' better or worse than '{current_item['item_name']}'?")
        comparison_choice = input("Type 'better' or 'worse': ").strip().lower()

        if comparison_choice == "better":
            right = mid - 1
            insertion_index = mid  # Insert before current
        elif comparison_choice == "worse":
            left = mid + 1
            insertion_index = left  # Insert after current
        else:
            print("Invalid input. Please type 'better' or 'worse'.")

    # Update prev_item and next_item
    new_prev_item_id = None
    new_next_item_id = None

    if insertion_index > 0:
        new_prev_item_id = ranked_items[insertion_index - 1]["item_id"]
    if insertion_index < len(ranked_items):
        new_next_item_id = ranked_items[insertion_index]["item_id"]

    # Insert the item into Rankings
    new_ranking = {
        "user_id": user_id,
        "topic_id": topic_id,
        "item_id": item_id,
        "prev_item": new_prev_item_id,
        "next_item": new_next_item_id,
        "score": None
    }
    supabase.table("Rankings").insert(new_ranking).execute()

    # Update adjacent items
    if new_prev_item_id:
        supabase.table("Rankings").update({"next_item": item_id}).eq("item_id", new_prev_item_id).execute()
    if new_next_item_id:
        supabase.table("Rankings").update({"prev_item": item_id}).eq("item_id", new_next_item_id).execute()

    # Distribute scores if there are 10+ items
    distribute_scores_normal_curve(user_id, topic_id)

    updated_rankings = fetch_ranked_items(user_id, topic_id)

    for rank in updated_rankings:
        item = supabase.table("Items").select("item_name").eq("item_id", rank["item_id"]).execute().data
        if item:
            rank["item_name"] = item[0]["item_name"]

    return {"message": "Item ranked successfully.", "ranking": updated_rankings}

@app.post("/remove")
def remove_item(request: RemoveItemRequest):
    user_id = request.user_id
    item_id = request.item_id
    topic_name = request.topic_name

    # Fetch topic ID
    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    # Check if item exists in rankings
    current_ranking = supabase.table("Rankings").select("*").eq("item_id", item_id).eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not current_ranking:
        raise HTTPException(status_code=404, detail="Item not found in rankings")

    current_ranking = current_ranking[0]
    prev_item_id = current_ranking["prev_item"]
    next_item_id = current_ranking["next_item"]

    # Update adjacent rankings
    if prev_item_id:
        supabase.table("Rankings").update({"next_item": next_item_id}).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": prev_item_id}).eq("item_id", next_item_id).execute()

    # Delete the current ranking
    supabase.table("Rankings").delete().eq("item_id", item_id).execute()

    return {"message": "Item removed successfully."}







