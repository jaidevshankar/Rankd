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

@app.get("/")
def read_rood():
    return {"message": "Hello, world!"}


# ------------------------- Helper Functions for New Logic ------------------------- #
# CHANGE: Helper function to update ratings using an Elo update adapted to a 0-10 scale.
def update_elo_ratings(item_a: dict, item_b: dict, winner: str, K: float = 1.0):
    """Update Elo-like ratings for two items based on which item was preferred (winner).
       Ratings are maintained on a 0-10 scale.
    """
    Ra, Rb = item_a["score"], item_b["score"]
    # Use a scale factor of 10 for the logistic formula
    expected_a = 1 / (1 + 10 ** ((Rb - Ra) / 10))
    expected_b = 1 - expected_a
    if winner == "A":
        Sa, Sb = 1.0, 0.0
    else:
        Sa, Sb = 0.0, 1.0
    new_Ra = Ra + K * (Sa - expected_a)
    new_Rb = Rb + K * (Sb - expected_b)
    # Clamp ratings to 0-10
    new_Ra = max(0.0, min(10.0, new_Ra))
    new_Rb = max(0.0, min(10.0, new_Rb))
    return new_Ra, new_Rb

# CHANGE: Function to redistribute initial calibration scores by category once 10 items exist.
def redistribute_initial_scores(user_id: int, topic_id: int):
    """
    Redistribute scores for the first 10 items, grouping by category and mapping:
      - Disliked items to [0.0, 4.0]
      - Liked items to [4.0, 7.0]
      - Loved items to [7.0, 10.0]
    """
    ranked_items = fetch_ranked_items(user_id, topic_id)
    # Build category groups by fetching each item's category from the Items table.
    categories = {"Loved": [], "Liked": [], "Disliked": []}
    for item in ranked_items:
        # Retrieve category from Items table
        itm = supabase.table("Items").select("item_name, category").eq("item_id", item["item_id"]).execute().data
        if itm and "category" in itm[0] and itm[0]["category"]:
            cat = itm[0]["category"]
            if cat in categories:
                categories[cat].append(item)
    # For each category, sort the items in descending order of current score and reassign scores
    for cat, items in categories.items():
        if not items:
            continue
        # Define target ranges
        if cat == "Loved":
            cat_min, cat_max = 7.0, 10.0
        elif cat == "Liked":
            cat_min, cat_max = 4.0, 7.0
        elif cat == "Disliked":
            cat_min, cat_max = 0.0, 4.0
        items.sort(key=lambda x: x.get("score", 0), reverse=True)
        n = len(items)
        for rank, item in enumerate(items, start=1):
            if n == 1:
                new_score = (cat_min + cat_max) / 2.0
            else:
                # Use a linear percentile mapping (rank/(n+1))
                percentile = rank / (n + 1)
                new_score = cat_min + (cat_max - cat_min) * percentile
            # Update the ranking with the new score
            supabase.table("Rankings").update({"score": new_score}).eq("ranking_id", item["ranking_id"]).execute()

def redistribute_scores_normal_curve(user_id: int, topic_id: int):
    """
    Redistribute scores for items in calibration (<10) by category,
    using separate normal distributions per category.
    Loved: mean=8.5, sd=1.0
    Liked: mean=5.5, sd=1.0
    Disliked: mean=2.0, sd=1.0
    """
    # Fetch all rankings for this user and topic
    rankings = supabase.table("Rankings").select("*").eq("user_id", user_id).eq("topic_id", topic_id).execute().data
    if not rankings:
        return
    
    # Build a map of item_id to ranking for easier lookup
    id_to_ranking = {r["item_id"]: r for r in rankings}
    
    # Group items by category
    categories = {"Loved": [], "Liked": [], "Disliked": []}
    
    # For each ranking, fetch the category from Items table
    for ranking in rankings:
        item_data = supabase.table("Items").select("item_name, category").eq("item_id", ranking["item_id"]).execute().data
        if item_data and "category" in item_data[0] and item_data[0]["category"]:
            category = item_data[0]["category"]
            if category in categories:
                # Add the full ranking object to the appropriate category list
                ranking["item_name"] = item_data[0]["item_name"]
                ranking["category"] = category
                categories[category].append(ranking)
    
    # Define distribution parameters for each category with appropriate standard deviations
    dist_params = {
        "Loved": {"mean": 8.5, "sd": 0.75},  # Narrower SD to keep scores in appropriate range
        "Liked": {"mean": 5.5, "sd": 0.75},
        "Disliked": {"mean": 2.0, "sd": 0.75}
    }
    
    # For each category, apply a separate normal distribution
    for category, items in categories.items():
        if not items:
            continue
            
        # Get category parameters
        params = dist_params[category]
        n = len(items)
        
        # Sort items by their linked list order (better items come later in the list)
        # Find the head of the linked list (item with no prev_item or prev_item outside this category)
        category_item_ids = {item["item_id"] for item in items}
        head = next((item for item in items if item["prev_item"] is None or item["prev_item"] not in category_item_ids), None)
        
        ordered_items = []
        if head:
            current = head
            while current and current["item_id"] in category_item_ids:
                ordered_items.append(current)
                next_id = current["next_item"]
                if next_id is None or next_id not in id_to_ranking:
                    break
                current = id_to_ranking.get(next_id)
        else:
            # Fallback to existing scores if linked list is broken
            ordered_items = sorted(items, key=lambda i: i.get("score", 0), reverse=False)
        
        # Now ordered_items has items from worst to best, so reverse it
        ordered_items.reverse()
        
        # Apply normal distribution (best items get higher percentiles)
        for idx, item in enumerate(ordered_items):
            if n == 1:
                # If only one item in category, assign the mean
                new_score = params["mean"]
            else:
                # Map position to percentile (best item = 0.95, worst = 0.05)
                # Use a more balanced distribution that stays within category bounds
                percentile = (n - idx - 0.5) / n
                # Convert percentile to Z-score
                z = scipy.stats.norm.ppf(percentile)
                # Calculate new score with appropriate scaling
                new_score = params["mean"] + z * params["sd"]
                # Clamp to ensure scores stay within appropriate ranges for each category
                if category == "Loved":
                    new_score = max(7.0, min(10.0, new_score))
                elif category == "Liked":
                    new_score = max(4.0, min(7.0, new_score))
                else:  # Disliked
                    new_score = max(0.0, min(4.0, new_score))
            
            # Update the score in the database
            supabase.table("Rankings").update({"score": new_score}).eq("ranking_id", item["ranking_id"]).execute()

# Calibration-mode insertion: maintain linked-list prev/next pointers
def insert_in_calibration(user_id: int, topic_id: int, new_item_id: int,
                            prev_item_id: Optional[int], next_item_id: Optional[int],
                            score: float = None):
    """
    Insert a new ranking node in calibration (<10 items),
    then update neighbors to maintain linked list.
    
    In our linked list structure:
    - next_item points to the item that is BETTER than the current item
    - prev_item points to the item that is WORSE than the current item
    """
    # Insert the new node
    insert_data = {
        "user_id": user_id,
        "topic_id": topic_id,
        "item_id": new_item_id,
        "prev_item": prev_item_id,  # prev_item is the worse item
        "next_item": next_item_id,  # next_item is the better item
        "score": score
    }
    supabase.table("Rankings").insert(insert_data).execute()

    # Update the previous (worse) item's next_item to point to this new item
    if prev_item_id is not None:
        supabase.table("Rankings") \
            .update({"next_item": new_item_id}) \
            .eq("user_id", user_id) \
            .eq("topic_id", topic_id) \
            .eq("item_id", prev_item_id) \
            .execute()

    # Update the next (better) item's prev_item to point to this new item
    if next_item_id is not None:
        supabase.table("Rankings") \
            .update({"prev_item": new_item_id}) \
            .eq("user_id", user_id) \
            .eq("topic_id", topic_id) \
            .eq("item_id", next_item_id) \
            .execute()

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

# Fetch rankings in linked list order (unchanged)
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
        item_data = supabase.table("Items").select("item_name, category").eq("item_id", current["item_id"]).execute().data
        # CHANGE: Also attach category from Items table here.
        if item_data:
            current["item_name"] = item_data[0]["item_name"]
            current["category"] = item_data[0].get("category", None)
        else:
            current["item_name"] = f"Item {current['item_id']}"
        ordered_rankings.append(current)
        current = id_to_ranking.get(current["next_item"])

    return ordered_rankings

# ------------------- /compare Endpoint with Calibration and Elo Modes ------------------- #
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

    # CHANGE: Check if the item already exists in Items table.
    existing_item = supabase.table("Items").select("*").eq("item_name", item_data["item_name"]).execute().data
    # If item does not exist, insert it.
    if not existing_item:
        # CHANGE: If user is in calibration phase (<10 items), ask for category.
        ranked_items = fetch_ranked_items(user_id, topic_id)
        if len(ranked_items) < 10:
            user_category = input("Calibration: Type 'Loved', 'Liked', or 'Disliked' for this new item: ").strip().capitalize()
            if user_category not in ["Loved", "Liked", "Disliked"]:
                raise HTTPException(status_code=400, detail="Category must be Loved, Liked, or Disliked")
            # Set default score based on category for first item in that category.
            default_scores = {"Loved": 8.5, "Liked": 5.5, "Disliked": 2.0}
            initial_score = default_scores[user_category]
            new_item = {
                "topic_id": topic_id,
                "item_name": item_data["item_name"],
                "created_by": user_id,
                "category": user_category  # CHANGE: store category
            }
            supabase.table("Items").insert(new_item).execute()
            existing_item = supabase.table("Items").select("*").eq("item_name", item_data["item_name"]).execute().data
        else:
            # In Elo mode, category is no longer needed; insert without it.
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
        # CHANGE: In calibration, score is not set until comparison; in Elo mode, we start with a default.
        "score": existing_item[0].get("score", None)
    }

    ranked_items = fetch_ranked_items(user_id, topic_id)
    total_items = len(ranked_items)

    # ------------------- Calibration Mode (<10 items) ------------------- #
    if total_items < 10:
        # Filter only items in the same category as the new item.
        new_category = existing_item[0].get("category", None)
        # If category not set (should not happen), ask user.
        if not new_category:
            new_category = input("Calibration: Type 'Loved', 'Liked', or 'Disliked' for this new item: ").strip().capitalize()
            if new_category not in ["Loved", "Liked", "Disliked"]:
                raise HTTPException(status_code=400, detail="Category must be Loved, Liked, or Disliked")
        same_cat_items = [it for it in ranked_items if it.get("category") == new_category]
        # If no items in this category exist yet, insert directly with default score.
        if not same_cat_items:
            default_scores = {"Loved": 8.5, "Liked": 5.5, "Disliked": 2.0}
            new_score = default_scores[new_category]
            new_ranking = {
                "user_id": user_id,
                "topic_id": topic_id,
                "item_id": item_info["id"],
                "prev_item": None,
                "next_item": None,
                "score": new_score
            }
            supabase.table("Rankings").insert(new_ranking).execute()
            ranked_items = fetch_ranked_items(user_id, topic_id)
            # If this was the 10th overall item, redistribute calibration scores.
            if len(ranked_items) == 10:
                redistribute_initial_scores(user_id, topic_id)
            return {"message": "Item added in calibration mode.", "ranking": ranked_items}
        # Otherwise, perform binary search-like comparison within this category.
        left, right = 0, len(same_cat_items) - 1
        insertion_index = -1
        while left <= right:
            mid = (left + right) // 2
            current_item = same_cat_items[mid]
            print(f"(Calibration) Is the new item '{item_info['name']}' better or worse than '{current_item['item_name']}'?")
            comparison_choice = input("Type 'better' or 'worse': ").strip().lower()
            if comparison_choice == "better":
                right = mid - 1
                insertion_index = mid  # Insert before current
            elif comparison_choice == "worse":
                left = mid + 1
                insertion_index = left  # Insert after current
            else:
                print("Invalid input. Please type 'better' or 'worse'.")
        # Determine prev and next items from the filtered same_cat_items
        # For "better" items: A is better than B means A.prev = B and B.next = A
        if comparison_choice == "better":
            if insertion_index >= len(same_cat_items):
                # New item is better than all existing items in this category
                prev_item_id = same_cat_items[-1]["item_id"] if same_cat_items else None
                next_item_id = None
            elif insertion_index <= 0:
                # New item is better than the first item
                prev_item_id = same_cat_items[0]["item_id"]
                next_item_id = same_cat_items[0]["next_item"]
            else:
                # New item is better than item at insertion_index
                prev_item_id = same_cat_items[insertion_index]["item_id"]
                next_item_id = same_cat_items[insertion_index]["next_item"]
        else:  # comparison_choice == "worse"
            if insertion_index >= len(same_cat_items):
                # New item is worse than the last compared item but better than nothing
                prev_item_id = same_cat_items[insertion_index-1]["prev_item"]
                next_item_id = same_cat_items[insertion_index-1]["item_id"]
            elif insertion_index <= 0:
                # New item is worse than everything
                prev_item_id = None
                next_item_id = same_cat_items[0]["item_id"]
            else:
                # New item is worse than current but better than previous
                prev_item_id = same_cat_items[insertion_index-1]["item_id"]
                next_item_id = same_cat_items[insertion_index]["item_id"]
        
        # Use the insert_in_calibration helper function to maintain linked list
        insert_in_calibration(
            user_id=user_id,
            topic_id=topic_id,
            new_item_id=item_info["id"],
            prev_item_id=prev_item_id,
            next_item_id=next_item_id
        )
        
        # After insertion, apply normal distribution to all items
        redistribute_scores_normal_curve(user_id, topic_id)
        
        # Fetch updated rankings to return
        ranked_items = fetch_ranked_items(user_id, topic_id)
        return {"message": "Item ranked successfully in calibration mode.", "ranking": ranked_items}

    # ------------------- Elo Mode (>=10 items) ------------------- #
    # In Elo mode, all comparisons and rerankings use the Elo system.
    else:
        # Use the overall ranked_items list (in Elo mode, category comparisons are not enforced)
        left, right = 0, len(ranked_items) - 1
        insertion_index = -1
        new_item_score = 5.5  # Default starting score for new items in Elo mode
        # If the item doesn't already have a score, assign the default.
        if item_info["score"] is None:
            item_info["score"] = new_item_score
            # Also update the Items table with this default score.
            supabase.table("Items").update({"score": new_item_score}).eq("item_id", item_info["id"]).execute()
        while left <= right:
            mid = (left + right) // 2
            current_item = ranked_items[mid]
            print(f"(Elo Mode) Is the item '{item_info['name']}' better or worse than '{current_item['item_name']}'?")
            comparison_choice = input("Type 'better' or 'worse': ").strip().lower()
            # In Elo mode, update scores using our Elo function for each comparison.
            # Fetch current scores from Items table for both items.
            comp_item_data = supabase.table("Items").select("score").eq("item_id", current_item["item_id"]).execute().data
            comp_score = comp_item_data[0]["score"] if comp_item_data else 5.5
            new_item_data = supabase.table("Items").select("score").eq("item_id", item_info["id"]).execute().data
            new_score = new_item_data[0]["score"] if new_item_data else new_item_score
            item_a = {"score": new_score}
            item_b = {"score": comp_score}
            if comparison_choice == "better":
                # Consider new item as winner ("A")
                new_score, comp_new_score = update_elo_ratings(item_a, item_b, "A")
                right = mid - 1
                insertion_index = mid  # new item should come before current_item
            elif comparison_choice == "worse":
                new_score, comp_new_score = update_elo_ratings(item_a, item_b, "B")
                left = mid + 1
                insertion_index = left  # new item should come after current_item
            else:
                print("Invalid input. Please type 'better' or 'worse'.")
                continue
            # Update both items' scores in Items table.
            supabase.table("Items").update({"score": new_score}).eq("item_id", item_info["id"]).execute()
            supabase.table("Items").update({"score": comp_new_score}).eq("item_id", current_item["item_id"]).execute()
            item_info["score"] = new_score
        # Determine overall prev_item and next_item from the Elo-mode ranked_items.
        prev_item_id = ranked_items[insertion_index - 1]["item_id"] if insertion_index > 0 else None
        next_item_id = ranked_items[insertion_index]["item_id"] if insertion_index < len(ranked_items) else None
        new_ranking = {
            "user_id": user_id,
            "topic_id": topic_id,
            "item_id": item_info["id"],
            "prev_item": prev_item_id,
            "next_item": next_item_id,
            "score": item_info["score"]
        }
        supabase.table("Rankings").insert(new_ranking).execute()
        if prev_item_id:
            supabase.table("Rankings").update({"next_item": item_info["id"]}).eq("item_id", prev_item_id).execute()
        if next_item_id:
            supabase.table("Rankings").update({"prev_item": item_info["id"]}).eq("item_id", next_item_id).execute()
        updated_rankings = fetch_ranked_items(user_id, topic_id)
        return {"message": "Item ranked successfully in Elo mode.", "ranking": updated_rankings}

# ------------------- End /compare Endpoint ------------------- #

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
    redistribute_initial_scores(user_id, topic_id)
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