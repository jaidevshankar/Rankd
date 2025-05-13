from typing import List, Dict, Optional
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
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API keys
TMDB_API_KEY = "213e8f28caae25b3b4cc495a11db1272"
sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(
    client_id="30b50adac3584635a327735395823eb7",
    client_secret="7471275b93e44c929743e06936760cc5"
))
GOOGLE_API_KEY = "AIzaSyCiBmNOrvLUCDq-7h_7Wn1td4OKeQGntbs"
GOOGLE_API_LINK = "https://www.googleapis.com/books/v1"
YELP_API_KEY = "ucZ-Ad_-RlW5rWrFLkUEo26NwPXJer4-8x5D-kwrJXYk8IOWseuNMiofbR0_YgpPBhzcDTa4GR4a6B9-xUyKPkmAsr6-xQALz73qxmeNSTIgVd0V2W1KZ7y760t7Z3Yx"

# Initialize Supabase
url = "https://gkvqpvkyncgblfbfmsoz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdnFwdmt5bmNnYmxmYmZtc296Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk5MTI5NSwiZXhwIjoyMDUwNTY3Mjk1fQ.KPPQgtkdf6tycv7CKe7hYhbKc0wx48mbeIXWAWU3OOs"
supabase: Client = create_client(url, key)

# Constants for Elo-like rating system
K_FACTOR = 32  # Maximum points that can be gained/lost in a single comparison
INITIAL_SCORE = 1500  # Starting score for new items
MIN_SCORE_DIFF = 100  # Minimum score difference between adjacent items

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

# Generalized request model (unchanged)
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

class ComparisonResponse(BaseModel):
    user_id: int
    new_item_id: int
    comparison_item_id: int
    topic_name: str
    is_better: bool

@app.get("/")
def read_rood():
    return {"message": "Hello, world!"}


# ------------------------- Helper Functions for New Logic ------------------------- #
# CHANGE: Helper function to update ratings using an Elo update adapted to a 0-10 scale.
def update_elo_ratings(item_a: dict, item_b: dict, winner: str, K: float = 32.0):
    """Update Elo-like ratings for two items based on which item was preferred (winner).
       Ratings are maintained on a 0-10 scale.
    """
    Ra, Rb = item_a["score"], item_b["score"]
    # Calculate expected scores
    expected_a = 1 / (1 + 10 ** ((Rb - Ra) / 400))
    expected_b = 1 - expected_a
    
    # Set actual scores based on winner
    if winner == "A":
        Sa, Sb = 1.0, 0.0
    else:
        Sa, Sb = 0.0, 1.0
    
    # Calculate new ratings
    new_Ra = Ra + K * (Sa - expected_a)
    new_Rb = Rb + K * (Sb - expected_b)
    
    return new_Ra, new_Rb

# CHANGE: Function to redistribute initial calibration scores by category once 10 items exist.
def redistribute_initial_scores(user_id: int, topic_id: int):
    """This function is no longer needed as we've removed the calibration phase"""
    pass

def redistribute_scores_normal_curve(user_id: int, topic_id: int):
    """This function is no longer needed as we've removed the calibration phase"""
    pass

# Calibration-mode insertion: maintain linked-list prev/next pointers
def insert_in_calibration(user_id: int, topic_id: int, new_item_id: int,
                            prev_item_id: Optional[int], next_item_id: Optional[int],
                            score: float = None):
    """This function is no longer needed as we've removed the calibration phase"""
    pass

# Helper to connect all items into a single linked list after calibration

def connect_full_linked_list(user_id: int, topic_id: int):
    """This function is no longer needed as we've removed the calibration phase"""
    pass

# ------------------------- End Helper Functions ------------------------- #


# API-specific fetch functions (unchanged)
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
    
@app.get("/rankings")
def get_rankings(topic: str, user_id: int = 1):
    """
    Get rankings for a specific topic and user.
    
    Parameters:
    - topic (str): The name of the topic
    - user_id (int): The user ID (defaults to 1 for testing)
    
    Returns:
    - Dict containing ranking array with item data
    """
    # First get the topic_id from the topic_name
    topic_data = supabase.table("Topics").select("topic_id").eq("topic_name", topic).execute().data
    if not topic_data:
        raise HTTPException(status_code=404, detail=f"Topic '{topic}' not found")
    topic_id = topic_data[0]["topic_id"]
    
    # Fetch rankings for the specified topic and user
    rankings = fetch_ranked_items(user_id, topic_id)
    
    # Enhance the response with additional item details that might be needed by frontend
    for item in rankings:
        # Make sure score is a float with 2 decimal places for consistent frontend display
        if item["score"] is not None:
            item["score"] = round(float(item["score"]), 2)
    
    return {"message": "Rankings retrieved successfully", "ranking": rankings}

def fetch_game_data(game_id: str):
    """
    Fetch game data from the IGDB API.
    """
    access_token = get_access_token()
    url = "https://api.igdb.com/v4/games"
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {access_token}"
    }
    
    body = "fields id,name,first_release_date,genres.name,platforms.name;"
    body += f" where id = {game_id};"
    
    try:
        response = requests.post(url, headers=headers, data=body)
        response.raise_for_status()
        
        game_data = response.json()
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
            
        game = game_data[0]
        
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


# Dispatcher for fetching item data (unchanged)
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
    """
    Fetch items ranked by a user for a specific topic in linked list order.
    - Items are ordered by the prev_item/next_item linked list structure
    - For each item, we fetch its name from the Items table
    - Returns items in descending order of rank (best items first)
    """
    # Get all rankings for this user and topic
    ranked_items = supabase.table("Rankings").select("*").eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not ranked_items:
        return []

    # Build a map of item_id to ranking for faster lookups
    id_to_ranking = {item["item_id"]: item for item in ranked_items}
    
    # First, try to find an item with no next_item (the best item)
    head = next((item for item in ranked_items if item["next_item"] is None), None)
    
    # If no best item is found, try finding an item with no prev_item (worst item)
    # and then traverse the list to the best item
    if not head:
        worst_item = next((item for item in ranked_items if item["prev_item"] is None), None)
        if worst_item:
            # Traverse to the best item (furthest next_item) starting from the worst
            current = worst_item
            visited = set([current["item_id"]])
            while current["next_item"] and current["next_item"] in id_to_ranking and current["next_item"] not in visited:
                next_id = current["next_item"]
                current = id_to_ranking[next_id]
                visited.add(current["item_id"])
                if not current["next_item"]:
                    head = current
                    break
        else:
            # If we can't determine the structure, use first item as head
            if ranked_items:
                head = ranked_items[0]
                # Update to mark it as having no next_item
                supabase.table("Rankings").update({"next_item": None}).eq("ranking_id", head["ranking_id"]).execute()
            else:
                return []
    
    # Traverse the linked list backwards from best to worst
    ordered_rankings = []
    current = head
    visited_ids = set()  # To prevent infinite loops in case of circular references
    
    while current and current["item_id"] not in visited_ids:
        # Mark this item as visited
        visited_ids.add(current["item_id"])
        
        # Fetch item details from Items table
        item_data = supabase.table("Items").select("item_name").eq("item_id", current["item_id"]).execute().data
        
        # Add item details to the ranking object
        if item_data:
            current["item_name"] = item_data[0]["item_name"]
        else:
            # Fallback if item not found
            current["item_name"] = f"Item {current['item_id']}"
        
        # Add to ordered list
        ordered_rankings.append(current)
        
        # Move to previous item in the linked list (worse item)
        prev_id = current["prev_item"]
        if prev_id and prev_id in id_to_ranking and prev_id not in visited_ids:
            current = id_to_ranking[prev_id]
        else:
            current = None

    return ordered_rankings

# Remove calibration-related functions and keep only the core ranking functionality
def insert_ranking(user_id: int, topic_id: int, new_item_id: int, prev_item_id: Optional[int], next_item_id: Optional[int], score: float):
    """Insert a new ranking with linked list structure"""
    insert_data = {
        "user_id": user_id,
        "topic_id": topic_id,
        "item_id": new_item_id,
        "prev_item": prev_item_id,
        "next_item": next_item_id,
        "score": score
    }
    supabase.table("Rankings").insert(insert_data).execute()

    # Update neighboring items
    if prev_item_id:
        supabase.table("Rankings").update({"next_item": new_item_id}).eq("user_id", user_id).eq("topic_id", topic_id).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": new_item_id}).eq("user_id", user_id).eq("topic_id", topic_id).eq("item_id", next_item_id).execute()

@app.post("/compare")
def compare_item(request: ItemComparisonRequest):
    user_id = request.user_id
    item_id = request.item_id
    topic_name = request.topic_name

    # Get topic
    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    try:
        item_data = fetch_item_data(topic_name, item_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Check if the item already exists in Items table
    existing_item = supabase.table("Items").select("*").eq("item_name", item_data["item_name"]).execute().data
    
    # Process the item and get item info
    if not existing_item:
        # Insert new item
        new_item = {
            "topic_id": topic_id,
            "item_name": item_data["item_name"],
            "created_by": user_id
        }
        supabase.table("Items").insert(new_item).execute()
        existing_item = supabase.table("Items").select("*").eq("item_name", item_data["item_name"]).execute().data

    item_info = {
        "id": existing_item[0]["item_id"],
        "name": existing_item[0]["item_name"]
    }

    # Check if this item is already ranked
    existing_ranking = supabase.table("Rankings").select("*")\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .eq("item_id", item_info["id"])\
        .execute().data
        
    # Get all ranked items for this user and topic
    ranked_items = fetch_ranked_items(user_id, topic_id)
    total_items = len(ranked_items)

    if existing_ranking:
        return {
            "status": "completed",
            "message": "Item already ranked",
            "ranking": ranked_items
        }

    if total_items == 0:
        # First item gets the initial score and is added to rankings
        insert_ranking(user_id, topic_id, item_info["id"], None, None, INITIAL_SCORE)
        return {
            "status": "completed",
            "message": "First item ranked successfully",
            "ranking": fetch_ranked_items(user_id, topic_id)
        }

    # For new items, we need to perform comparisons
    # First, add the new item to the rankings with a default score
    insert_ranking(user_id, topic_id, item_info["id"], None, None, INITIAL_SCORE)
    
    # Select up to 3 random items for comparison
    num_comparisons = min(3, total_items)
    comparison_items = random.sample(ranked_items, num_comparisons)
    
    # Get the first comparison item
    comparison_item = comparison_items[0]
    
    return {
        "status": "comparison_needed",
        "message": "Compare with existing item",
        "new_item": {
            "id": item_info["id"],
            "name": item_info["name"]
        },
        "comparison_item": {
            "id": comparison_item["item_id"],
            "name": comparison_item["item_name"]
        },
        "remaining_comparisons": num_comparisons - 1
    }

@app.post("/respond_comparison")
def respond_comparison(request: ComparisonResponse):
    """Process a comparison response from the user"""
    user_id = request.user_id
    new_item_id = request.new_item_id
    comparison_item_id = request.comparison_item_id
    topic_name = request.topic_name
    is_better = request.is_better

    # Get topic_id
    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    # Get both items' rankings
    new_item_ranking = supabase.table("Rankings").select("*")\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .eq("item_id", new_item_id)\
        .execute().data
    
    comparison_item_ranking = supabase.table("Rankings").select("*")\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .eq("item_id", comparison_item_id)\
        .execute().data

    if not new_item_ranking or not comparison_item_ranking:
        raise HTTPException(status_code=404, detail="One or both items not found in rankings")

    new_item_ranking = new_item_ranking[0]
    comparison_item_ranking = comparison_item_ranking[0]

    # Get current scores
    new_item_score = new_item_ranking["score"] or INITIAL_SCORE
    comparison_item_score = comparison_item_ranking["score"] or INITIAL_SCORE

    # Calculate new scores using Elo system
    if is_better:
        # New item is better than comparison item
        new_score, updated_comparison_score = update_elo_ratings(
            {"score": new_item_score},
            {"score": comparison_item_score},
            "A",
            K_FACTOR
        )
    else:
        # New item is worse than comparison item
        updated_comparison_score, new_score = update_elo_ratings(
            {"score": comparison_item_score},
            {"score": new_item_score},
            "A",
            K_FACTOR
        )

    # Update both items' scores
    supabase.table("Rankings")\
        .update({"score": updated_comparison_score})\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .eq("item_id", comparison_item_id)\
        .execute()

    supabase.table("Rankings")\
        .update({"score": new_score})\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .eq("item_id", new_item_id)\
        .execute()

    # Get all rankings for this user/topic
    all_rankings = supabase.table("Rankings")\
        .select("*")\
        .eq("user_id", user_id)\
        .eq("topic_id", topic_id)\
        .order("score", desc=True)\
        .execute().data

    # Update linked list structure based on new scores
    for i, item in enumerate(all_rankings):
        prev_id = all_rankings[i-1]["item_id"] if i > 0 else None
        next_id = all_rankings[i+1]["item_id"] if i < len(all_rankings) - 1 else None

        supabase.table("Rankings")\
            .update({
                "prev_item": prev_id,
                "next_item": next_id
            })\
            .eq("user_id", user_id)\
            .eq("topic_id", topic_id)\
            .eq("item_id", item["item_id"])\
            .execute()

    # Get remaining items for comparison (excluding already compared items)
    remaining_items = [item for item in all_rankings 
                      if item["item_id"] != new_item_id 
                      and item["item_id"] != comparison_item_id]

    if remaining_items:
        # Select next random item for comparison
        next_comparison_item = random.choice(remaining_items)
        
        # Get item name from Items table
        item_name = supabase.table("Items")\
            .select("item_name")\
            .eq("item_id", next_comparison_item["item_id"])\
            .execute().data[0]["item_name"]

        return {
            "status": "comparison_needed",
            "message": "Compare with another item",
            "new_item": {
                "id": new_item_id,
                "name": supabase.table("Items")
                    .select("item_name")
                    .eq("item_id", new_item_id)
                    .execute().data[0]["item_name"]
            },
            "comparison_item": {
                "id": next_comparison_item["item_id"],
                "name": item_name
            },
            "remaining_comparisons": len(remaining_items) - 1
        }

    return {
        "status": "completed",
        "message": "Item ranked successfully",
        "ranking": fetch_ranked_items(user_id, topic_id)
    }

@app.post("/rerank")
def rerank_item(request: ItemRerankRequest):
    user_id = request.user_id
    item_id = request.item_id
    item_name = supabase.table("Items").select("*").eq("item_id", item_id).execute().data[0]["item_name"]
    topic_name = request.topic_name

    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    current_ranking = supabase.table("Rankings").select("*").eq("item_id", item_id).eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not current_ranking:
        raise HTTPException(status_code=404, detail="Item not found in rankings")

    current_ranking = current_ranking[0]
    prev_item_id = current_ranking["prev_item"]
    next_item_id = current_ranking["next_item"]

    if prev_item_id:
        supabase.table("Rankings").update({"next_item": next_item_id}).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": prev_item_id}).eq("item_id", next_item_id).execute()

    supabase.table("Rankings").delete().eq("item_id", item_id).execute()

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
    
    rankings = []
    for rank in ranked_items:
        item = supabase.table("Items").select("item_name").eq("item_id", rank["item_id"]).execute().data
        if item:
            rank["item_name"] = item[0]["item_name"]
        rankings.append(rank)

    left, right = 0, len(ranked_items) - 1
    insertion_index = -1
    while left <= right:
        mid = (left + right) // 2
        current_item = rankings[mid]
        print(f"Is the item '{item_name}' better or worse than '{current_item['item_name']}'?")
        comparison_choice = input("Type 'better' or 'worse': ").strip().lower()
        if comparison_choice == "better":
            right = mid - 1
            insertion_index = mid
        elif comparison_choice == "worse":
            left = mid + 1
            insertion_index = left
        else:
            print("Invalid input. Please type 'better' or 'worse'.")
    new_prev_item_id = rankings[insertion_index - 1]["item_id"] if insertion_index > 0 else None
    new_next_item_id = rankings[insertion_index]["item_id"] if insertion_index < len(rankings) else None
    new_ranking = {
        "user_id": user_id,
        "topic_id": topic_id,
        "item_id": item_id,
        "prev_item": new_prev_item_id,
        "next_item": new_next_item_id,
        "score": None
    }
    supabase.table("Rankings").insert(new_ranking).execute()
    if new_prev_item_id:
        supabase.table("Rankings").update({"next_item": item_id}).eq("item_id", new_prev_item_id).execute()
    if new_next_item_id:
        supabase.table("Rankings").update({"prev_item": item_id}).eq("item_id", new_next_item_id).execute()
    return {"message": "Item ranked successfully.", "ranking": rankings}

@app.post("/remove")
def remove_item(request: RemoveItemRequest):
    user_id = request.user_id
    item_id = request.item_id
    topic_name = request.topic_name

    topic = supabase.table("Topics").select("*").eq("topic_name", topic_name).execute().data
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    topic_id = topic[0]["topic_id"]

    current_ranking = supabase.table("Rankings").select("*").eq("item_id", item_id).eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not current_ranking:
        raise HTTPException(status_code=404, detail="Item not found in rankings")

    current_ranking = current_ranking[0]
    prev_item_id = current_ranking["prev_item"]
    next_item_id = current_ranking["next_item"]

    if prev_item_id:
        supabase.table("Rankings").update({"next_item": next_item_id}).eq("item_id", prev_item_id).execute()
    if next_item_id:
        supabase.table("Rankings").update({"prev_item": prev_item_id}).eq("item_id", next_item_id).execute()

    supabase.table("Rankings").delete().eq("item_id", item_id).execute()

    return {"message": "Item removed successfully."}

@app.get("/topics")
def get_topics():
    """
    Get all available topics.
    
    Returns:
    - Dict containing array of topic names
    """
    topics = supabase.table("Topics").select("topic_name").execute().data
    topic_names = [topic["topic_name"] for topic in topics]
    
    # If no topics exist yet, return default topics
    if not topic_names:
        topic_names = ["Movies", "TV Shows", "Albums", "Books", "Video Games", "Restaurants"]
        
    return {"topics": topic_names}