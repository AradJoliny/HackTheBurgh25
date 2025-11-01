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
