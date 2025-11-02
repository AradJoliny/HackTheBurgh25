from datetime import datetime
def parse_time(data):
    if not isinstance(data, dict):
        return None

    time = data.get('time')
    if not time or not isinstance(time, str):
        return None
    try:
        valid_time = datetime.strptime(time, '%H:%M')
        return valid_time.strftime('%H:%M')
    except ValueError:
        return None

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
    if not isinstance(data, dict):
        return None

    if 'coords' in data and isinstance(data['coords'], (list, tuple)) and len(data['coords']) >= 2:
        try:
            lng = float(data['coords'][0])
            lat = float(data['coords'][1])
            return {'lng': lng, 'lat': lat}
        except (ValueError, TypeError):
            return None
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
