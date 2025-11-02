from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def get_opening_hours(place_id):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY not found in environment")

    details_params = {
        "place_id": place_id,
        "fields": "opening_hours",
        "key": api_key
    }

def is_open(place_id, current_time):
    opening_hours = get_opening_hours(place_id)
    if not opening_hours:
        return False


    for period in opening_hours.get("periods", []):
        if period["open"]["time"] <= current_time <= period["close"]["time"]:
            return True
    return False