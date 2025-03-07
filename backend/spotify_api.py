import os
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()

class SpotifyClient:
    def __init__(self):
        self.client = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=os.getenv('SPOTIFY_CLIENT_ID'),
            client_secret=os.getenv('SPOTIFY_CLIENT_SECRET'),
            redirect_uri=os.getenv('SPOTIFY_REDIRECT_URI'),
            scope='user-library-read playlist-modify-public user-top-read'
        ))
    
    def get_user_top_tracks(self, limit=20, offset=0, time_range='medium_term'):
        """
        Get user's top tracks
        time_range: short_term (4 weeks), medium_term (6 months), long_term (all time)
        """
        return self.client.current_user_top_tracks(
            limit=limit,
            offset=offset,
            time_range=time_range
        )

    def get_user_playlists(self, limit=50):
        """Get user's playlists"""
        return self.client.current_user_playlists(limit=limit)