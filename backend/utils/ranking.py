from http.client import HTTPException
from pydantic import BaseModel
import scipy
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
import requests
from fastapi import HTTPException
import supabase

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

class ItemComparisonRequest(BaseModel):
    user_id: int
    item_id: str
    topic_name: str

# Dispatcher for fetching item data
def fetch_item_data(topic_name: str, item_id: str):
    topic_apis = {
        "Albums": fetch_album,
        "Movies": fetch_movie,
        "TV Shows": fetch_tv,
        "Books": fetch_book,
        "Restaurants": fetch_restaurant_data
        # Add other topic handlers here
    }

    if topic_name not in topic_apis:
        raise HTTPException(status_code=400, detail=f"Unsupported topic: {topic_name}")


    return topic_apis[topic_name](item_id)

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