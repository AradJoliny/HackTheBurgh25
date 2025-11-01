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

# structure for looking up duration of each activity
activity_durations = {
    'cafe': 60,
    'coffe_shop': 60,
    'restaurant': 120,
    'movie_theater': 150,
    'museum': 150,
    'art_gallery': 150,
    'park': 90,
    'hiking_area': 90,
    'botanical_garden': 90,
    'zoo': 120,
    'picnic_ground': 90,
    'concert_hall': 150,
    'theater': 150,
    'stadium': 150,
    'amphitheater': 150,
    'bar': 90,
    'shopping_mall': 90,
    'department_store': 90,
    'book_store': 90,
    'Walk': 60
}

# maps length of the date to a duration in minutes
def calculate_date_duration(duration):
    duration_mapping = {
        'short': 120,
        'medium': 300,
        'long': 480,
        'full_day': 720
    }
    # defaults to short if unknown
    return duration_mapping.get(duration, 180)

# choose the first activity in the list that meets the constraints
def select_next_activity(results, current_location, distances, used_types, remaining_time, current_time):
    for activity in results:
        # skip if activity type has already been done
        activity_types = set(activity.get('types', []))
        if activity_types & used_types:
            continue

        travel_time = get_travel_time(activity, current_location, distances)

        # just use the first type to determine duration, or default to 60
        primary_type = activity['types'][0] if activity.get('types') else None
        activity_duration = activity_durations.get(primary_type, 60)

        total_time_needed = travel_time + activity_duration
        if total_time_needed > remaining_time:
            continue

        return activity
    # no suitable venue found
    return None


# finds travel time between two venues using precomputed distances
def get_travel_time(activity, current_location, distances):
    # to-do: implement based on the structure of the distance matrix
    return travel_time

# template for creating full schedule of activities
# will be called on all four durations to return separate schedules
def create_schedule(duration, results, distances, start_time, user_location):
    total_minutes = calculate_date_duration(duration)
    schedule = []
    current_time = start_time
    current_location = user_location
    used_types = set()
    remaining_time = total_minutes

    # shortest activity time is 60 minutes
    while remaining_time >= 60:
        best_activity = select_next_activity(
            results,current_location,distances,used_types,remaining_time,current_time)
        if not best_activity:
            break

        # add travel time
        travel_time = get_travel_time(best_activity,current_location,distances)
        current_time += travel_time
        remaining_time -= travel_time

        # add activity
        primary_type = best_activity['types'][0] if best_activity.get('types') else None
        activity_duration = activity_durations.get(primary_type, 60)
        schedule.append({
            'venue': best_activity,
            'start_time': current_time,
            'duration': activity_duration,
            'arrival_time': current_time - travel_time
        })

        current_time += activity_duration
        remaining_time -= activity_duration
        current_location = best_activity
        # adding all types from this activity to used_types
        if best_activity.get('types'):
            used_types.add(best_activity['types'])
    return schedule