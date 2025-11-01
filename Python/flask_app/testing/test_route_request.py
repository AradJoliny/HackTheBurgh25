from Python.flask_app.findActivities import find_activities
from Python.flask_app.routeRequest import calculate_route, extract_travel_mode
from google.maps import routing_v2

from Python.flask_app.storage.store_data import save_choices


def test_find_activities_edinburgh():
    """Test finding activities in Edinburgh"""

    # Edinburgh Castle coordinates
    edinburgh_choices = {
        "coordinates": {
            "lat": 55.950231,
            "lng": -3.187588
        },
        "start_time": "10:00",
        "categories": ["Coffee"],
        "radius": 5000  # 2km radius
    }

    # Save test choices first
    save_choices(
        edinburgh_choices["coordinates"],
        edinburgh_choices["start_time"],
        edinburgh_choices["categories"],
        edinburgh_choices["radius"],
        edinburgh_choices.get("travel_mode", "WALK")
    )

    try:
        result = find_activities()

        if result.get("status") == "ok":
            print("✓ Successfully found activities in Edinburgh!")
            print(f"  Choices: {result['choices']}")
            print(f"  Found {len(result['activities'])} activities:")

            for activity in result['activities'][:5]:  # Show first 5
                print(f"\n  - {activity['name']}")
                print(f"    Address: {activity['address']}")
                print(f"    Rating: {activity.get('rating', 'N/A')}")
                print(f"    Types: {', '.join(activity['types'][:3])}")
        else:
            print(f"✗ Error: {result.get('message')}")

    except Exception as e:
        print(f"✗ Error: {e}")


def test_calculate_route():
    """Test basic route calculation between two points in San Francisco"""

    # Mock choices
    choices = {
        "travel_mode": "DRIVE",
        "categories": ["restaurant", "museum"],
        "start_time": "08:00",
        "coords": {"lng": -122.3937, "lat": 37.7955},
        "radius": 1000
    }

    # Test locations: SF Ferry Building to Golden Gate Bridge
    origin = {"lat": 37.7955, "lng": -122.3937}
    destination = {"lat": 37.8199, "lng": -122.4783}

    try:
        travel_mode = extract_travel_mode(choices)
        response = calculate_route(
            origin=origin,
            destination=destination,
            travel_mode=travel_mode
        )

        if response and hasattr(response, 'routes') and response.routes:
            route = response.routes[0]
            print("✓ Route calculation successful!")
            print(f"  Distance: {route.distance_meters}m")
            print(f"  Duration: {route.duration}s")
            print(f"  Polyline: {route.polyline.encoded_polyline[:50]}...")
        else:
            print("✗ No routes returned")

    except Exception as e:
        print(f"✗ Error: {e}")


def test_travel_modes():
    """Test different travel modes"""
    origin = {"lat": 37.7955, "lng": -122.3937}
    destination = {"lat": 37.8199, "lng": -122.4783}

    modes = ["DRIVE", "WALK", "BICYCLE", "TRANSIT"]

    for mode in modes:
        try:
            response = calculate_route(origin, destination, mode)
            if response and response.routes:
                print(f"✓ {mode}: {response.routes[0].duration}s")
            else:
                print(f"✗ {mode}: No route")
        except Exception as e:
            print(f"✗ {mode}: {e}")


if __name__ == "__main__":
    # print("Testing route calculation...\n")
    # test_calculate_route()
    print("\nTesting travel modes...\n")
    test_travel_modes()
    print("Testing find_activities in Edinburgh...\n")
    test_find_activities_edinburgh()
