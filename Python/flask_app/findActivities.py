def find_activities(coords):
    """
    Receives validated coords dict with 'lat' and 'lon' keys.
    Returns a JSON-serializable dict with activities.
    """
    lng = coords.get("lng")
    lat = coords.get("lat")

    return {"status": "ok", "lng": lng, "lat": lat}


def translate_tags(categories):
    # mappings from user selected activities to API tags for 'type'
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
        return translated_types
