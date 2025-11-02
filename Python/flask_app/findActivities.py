import os
import googlemaps
from dotenv import load_dotenv
from Python.flask_app.storage.store_data import load_choices

# Load environment variables
load_dotenv()

category_mapping = {
    'Coffee': ['cafe', 'coffee_shop'],
    'Dinner': ['restaurant'],
    'Lunch': ['cafe', 'restaurant'],
    'Movies': ['movie_theater'],
    'Museum': ['museum', 'art_gallery'],
    'Outdoor': ['park', 'hiking_area', 'botanical_garden', 'zoo', 'picnic_ground'],
    'Live Events': ['concert_hall', 'theater', 'stadium', 'amphitheater'],
    'Drinks': ['bar'],
    'Shopping': ['shopping_mall', 'department_store', 'book_store'],
    'Walk': ['park', 'trail']  # adjust as needed
}

VALID_TYPES = set()
for types_list in category_mapping.values():
    VALID_TYPES.update(types_list)


def find_activities():
    choices = load_choices()
    if not choices:
        return {"status": "error", "message": "No saved choices found"}

    coords = choices.get("coordinates")
    time = choices.get("start_time")
    categories = choices.get("categories")
    radius = choices.get("radius", 1000)  # default 1km

    tags = translate_tags(categories)

    # search nearby places
    results = search_nearby_places(coords, tags, radius)

    return {
        "status": "ok",
        "choices": choices,
        "activities": results
    }


def search_nearby_places(coords, types, radius_meters):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY not found in environment")

    gmaps = googlemaps.Client(key=api_key)

    activities = []
    seen_place_ids = set()  # Avoid duplicates

    try:
        for place_type in types:
            places_result = gmaps.places_nearby(
                location=(coords['lat'], coords['lng']),
                radius=radius_meters,
                type=place_type
            )

            print(f"Found {len(places_result.get('results', []))} places for type '{place_type}'")

            for place in places_result.get("results", []):
                place_id = place.get("place_id")

                # Skip if we've already added this place
                if place_id in seen_place_ids:
                    continue

                name = place.get("name", "")

                if name.lower() in ['edinburgh', 'scotland', 'united kingdom']:
                    continue

                seen_place_ids.add(place_id)

                place_types = [t for t in place.get("types", []) if t in VALID_TYPES]
                activities.append({
                    "name": place.get("name", "Unknown"),
                    "address": place.get("vicinity", ""),
                    "types": place_types,
                    "rating": place.get("rating"),
                    "location": {
                        "lat": place["geometry"]["location"]["lat"],
                        "lng": place["geometry"]["location"]["lng"]
                    }
                })
    except Exception as e:
        print(f"Error calling Google Places API: {e}")
        return []

    return activities


def translate_tags(categories):
    tags = []
    for category in categories:
        if category in category_mapping:
            tags.extend(category_mapping[category])
    return tags
