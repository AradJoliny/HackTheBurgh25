from google.maps import routing_v2
from dotenv import load_dotenv
import os

from Python.flask_app.storage.store_data import load_choices

# Load environment variables from .env file
load_dotenv()


def extract_travel_mode(choices=None):
    if choices is None:
        raise ValueError("Choices cannot be None")

    mode = choices.get("travel_mode")
    if mode is None:
        raise KeyError("The key 'travel_mode' is missing in choices")

    return mode.upper()


def _to_route_travel_mode(mode):
    if isinstance(mode, routing_v2.RouteTravelMode):
        return mode
    return getattr(routing_v2.RouteTravelMode, str(mode))


# travel_mode = extract_travel_mode()

def calculate_route(origin, destination, travel_mode):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_PLACES_API_KEY not found in environment")

    # Create client options with API key
    from google.api_core.client_options import ClientOptions
    client_options = ClientOptions(api_key=api_key)

    client = routing_v2.RoutesClient(client_options=client_options)

    mode_enum = _to_route_travel_mode(travel_mode)

    request = routing_v2.ComputeRoutesRequest(
        origin=routing_v2.Waypoint(
            location=routing_v2.Location(
                lat_lng={"latitude": origin['lat'], "longitude": origin['lng']}
            )
        ),
        destination=routing_v2.Waypoint(
            location=routing_v2.Location(
                lat_lng={"latitude": destination['lat'], "longitude": destination['lng']}

            )
        ),
        travel_mode=mode_enum
    )
    response = client.compute_routes(
        request=request,
        metadata=[
            ("x-goog-fieldmask", "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline")
        ]
    )

    return response



# ADDED FOR TESTING PURPOSES
if __name__ == "__main__":
    travel_mode = extract_travel_mode()
