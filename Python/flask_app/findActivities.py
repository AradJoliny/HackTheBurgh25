import os

from dotenv import load_dotenv

from Python.flask_app.storage.store_data import load_choices
from google.maps import places_v1


# Load environment variables from .env file
load_dotenv()


def find_activities():
    choices = load_choices()

    if not choices:
        return {"status": "error", "message": "no saved choices found"}

    coords = choices.get("coordinates")
    time = choices.get("start_time")
    categories = choices.get("categories")
    radius = choices.get("radius")

    tags = translate_tags(categories)

    # find places
    results = search_nearby_places(coords, radius, tags)

    return {
        "status": "ok",
        "choices": choices,
        "activities": results
    }


def search_nearby_places(coords, included_types, radius_meters):
    api_key = os.getenv('GOOGLE_PLACES_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY not found in environment")

    # call Google places api nearby search (new version)
    client = places_v1.PlacesClient()

    # create the location restriction (circle with given user radius)
    location_restriction = places_v1.SearchLocationRestriction(
        circle = places_v1.Circle(
            center = places_v1.LatLng(
                latitude = coords['lat'],
                longitude = coords['lng']
            ),
            radius = radius_meters
        )
    )

    # build request
    request = places_v1.SearchPlaceRequest(
        location_restriction = location_restriction,
        included_types = included_types,
        maxResultCount = 10,
        rank_preference = places_v1.SearchPlaceRequest.RankPreference.POPULARITY
    )

    try:
        response = client.search_nearby_places(request=request)

        activities = []
        for place in response.places:
            activities.append({
                "name": place.display_name.text if place.display_name else "Unknown",
                "address": place.formatted_address if place.formatted_address else "",
                "types": list(place.types) if place.types else [],
                "rating": place.rating if hasattr(place, 'rating') else None,
                "location": {
                    "lat": place.location.latitude,
                    "lng": place.location.longitude
                } if place.location else None
            })

        return activities
    except Exception as e:
        print(f"Error during Places API call: {e}")
        return []


def translate_tags(categories):
    # mappings from user-selected activities to API tags for 'type'
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
        # walk should not be included when querying the API
        'Walk"': ['Walk']
    }

    translated_types = []
    for category in categories:
        if category in category_mapping:
            translated_types.extend(category_mapping[category])

    return list(set(translated_types))
