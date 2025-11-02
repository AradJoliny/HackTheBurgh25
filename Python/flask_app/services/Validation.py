from datetime import datetime
def parse_time(data):
    if not isinstance(data, dict):
        return None

    start_time = data.get('start_time')
    if not start_time or not isinstance(start_time, str):
        return None
    return start_time

def parse_categories(data):
    if not isinstance(data, dict):
        return None

    categories = data.get('categories')
    if not categories or not isinstance(categories, list):
        return None

    if all(isinstance(category,str) for category in categories):
        return categories
    return None


def parse_coords(data):
    coords = data.get('coordinates')
    if not coords:
        return None

    if isinstance(coords, dict):
        lat = coords.get('lat')
        lng = coords.get('lng')
        if lat is not None and lng is not None:
            return {'lat': float(lat), 'lng': float(lng)}

    return None


def handle_coordinates(coords):
    """Business logic for validated coordinates."""

    if not isinstance(coords, dict):
        return {"status": "error", "message": "invalid coords"}

    lng = coords.get("lng")
    lat = coords.get("lat")

    if lat is None or lng is None:
        return {"status": "error", "message": "missing lat or lng"}

    if lat < -90 or lat > 90 or lng < -180 or lng > 180:
        return {"status": "error", "message": "lat or lng out of bounds"}

    # do validation/transform/DB calls/third-party calls here
    return {"status": "ok", "lng": lng, "lat": lat, "message": f"Processed {lng},{lat}"}
