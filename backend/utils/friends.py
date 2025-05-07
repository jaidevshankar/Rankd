from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Optional
from supabase import create_client, Client
from datetime import datetime
import re

# Initialize Supabase (reuse credentials as in other utils)
url = "https://gkvqpvkyncgblfbfmsoz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrdnFwdmt5bmNnYmxmYmZtc296Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk5MTI5NSwiZXhwIjoyMDUwNTY3Mjk1fQ.KPPQgtkdf6tycv7CKe7hYhbKc0wx48mbeIXWAWU3OOs"
supabase: Client = create_client(url, key)

router = APIRouter()

# --- Get all accepted friends for a user ---
@router.get("")
def get_friends(user_id: int):
    # Friends are bidirectional, so check both user_id and friend_id
    friends1 = supabase.table("Friends").select("friend_id, accepted").eq("user_id", user_id).eq("accepted", True).execute().data
    friends2 = supabase.table("Friends").select("user_id, accepted").eq("friend_id", user_id).eq("accepted", True).execute().data
    # Get user info for all friends
    friend_ids = [f["friend_id"] for f in friends1] + [f["user_id"] for f in friends2]
    if not friend_ids:
        return []
    users = supabase.table("Users").select("user_id, username, email").in_("user_id", friend_ids).execute().data
    return users

# --- Fuzzy search for users to add as friends ---
@router.get("/search")
def search_users(query: str = Query(..., min_length=2), exclude_user_id: int = Query(...)):
    pattern = f"%{query}%"
    # Search by username
    users_username = supabase.table("Users").select("user_id, username, email") \
        .ilike("username", pattern).neq("user_id", exclude_user_id).execute().data
    # Search by email
    users_email = supabase.table("Users").select("user_id, username, email") \
        .ilike("email", pattern).neq("user_id", exclude_user_id).execute().data
    # Combine and deduplicate by user_id
    users_dict = {u["user_id"]: u for u in (users_username or []) + (users_email or [])}
    return list(users_dict.values())

# --- Send a friend request ---
@router.post("/request")
def send_friend_request(user_id: int = Body(...), friend_id: int = Body(...)):
    # Check if already friends or pending
    existing = supabase.table("Friends").select("*").eq("user_id", user_id).eq("friend_id", friend_id).execute().data
    if existing:
        raise HTTPException(status_code=400, detail="Friend request already sent or already friends.")
    # Insert request (accepted = False)
    supabase.table("Friends").insert({
        "user_id": user_id,
        "friend_id": friend_id,
        "created_at": datetime.now().isoformat(),
        "accepted": False
    }).execute()
    return {"message": "Friend request sent."}

# --- Accept a friend request ---
@router.post("/accept")
def accept_friend_request(user_id: int = Body(...), friend_id: int = Body(...)):
    # user_id is the one accepting, friend_id is the one who sent
    updated = supabase.table("Friends").update({"accepted": True}).eq("user_id", friend_id).eq("friend_id", user_id).eq("accepted", False).execute()
    if not updated.data:
        raise HTTPException(status_code=404, detail="No pending friend request found.")
    return {"message": "Friend request accepted."}

# --- Get outgoing and pending requests ---
@router.get("/requests")
def get_friend_requests(user_id: int):
    # Outgoing: requests sent by user, not yet accepted
    outgoing = supabase.table("Friends").select("friend_id, created_at").eq("user_id", user_id).eq("accepted", False).execute().data
    # Incoming: requests received by user, not yet accepted
    incoming = supabase.table("Friends").select("user_id, created_at").eq("friend_id", user_id).eq("accepted", False).execute().data
    # Get user info for both
    outgoing_ids = [r["friend_id"] for r in outgoing]
    incoming_ids = [r["user_id"] for r in incoming]
    outgoing_users = supabase.table("Users").select("user_id, username, email").in_("user_id", outgoing_ids).execute().data if outgoing_ids else []
    incoming_users = supabase.table("Users").select("user_id, username, email").in_("user_id", incoming_ids).execute().data if incoming_ids else []
    return {"outgoing": outgoing_users, "incoming": incoming_users} 