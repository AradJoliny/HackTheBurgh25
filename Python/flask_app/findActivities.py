import os

from dotenv import load_dotenv
from google.type import latlng_pb2

from Python.flask_app.storage.store_data import load_choices
from google.maps import places_v1


# Load environment variables from .env file
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
    'Walk': ['Walk']
}

# Create the set of valid types from the mapping
VALID_TYPES = set()
for types_list in category_mapping.values():
    VALID_TYPES.update(types_list)


def find_activities():
    choices = load_choices()

    if not choices:
        return {"status": "error", "message": "no saved choices found"}

    coords = choices.get("coordinates")
    time = choices.get("start_time")
    categories = choices.get("categories")
    radius = choices.get("radius")

    tags = translate_tags(categories)

    # print("Translated tags for search:", tags)

    # find places
    results = search_nearby_places(coords, tags, radius)

    return {
        "status": "ok",
        "choices": choices,
        "activities": results
    }


def search_nearby_places(coords, included_types, radius_meters):
    api_key = os.getenv('GOOGLE_PLACES_API_KEY')
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY not found in environment")

    # Create client options with API key
    from google.api_core.client_options import ClientOptions
    client_options = ClientOptions(api_key=api_key)

    client = places_v1.PlacesClient(client_options=client_options)

    # Create center using google.type.latlng_pb2.LatLng
    center = latlng_pb2.LatLng(
        latitude=coords['lat'],
        longitude=coords['lng']
    )

    # Create location restriction
    location_restriction = places_v1.SearchNearbyRequest.LocationRestriction(
        circle=places_v1.Circle(
            center=center,
            radius=radius_meters
        )
    )

    # build request
    request = places_v1.SearchNearbyRequest(
        location_restriction=location_restriction,
        included_types=included_types,
        max_result_count=15,
        rank_preference=places_v1.SearchNearbyRequest.RankPreference.POPULARITY
    )


    try:
        metadata = [("x-goog-fieldmask",
                     "places.displayName,places.formattedAddress,places.types,places.rating,places.location")]
        response = client.search_nearby(request=request, metadata=metadata)



        activities = []
        for place in response.places:
            activities.append({
                "name": place.display_name.text if place.display_name else "Unknown",
                "address": place.formatted_address if place.formatted_address else "",
                "types": [t for t in place.types if t in VALID_TYPES] if place.types else [],
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
    tags = []
    for category in categories:
        if category in category_mapping:  # Uses global category_mapping
            tags.extend(category_mapping[category])
    return tags


