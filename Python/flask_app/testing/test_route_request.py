from Python.flask_app.findActivities import find_activities
from Python.flask_app.routeRequest import calculate_route, extract_travel_mode
from Python.flask_app.schedular import create_schedule, calculate_date_duration
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
        "categories": ["Coffee", "Museum", "Restaurant", "Park", "Bar"],
        "radius": 5000,
        "travel_mode": "WALK"
    }

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

def test_create_schedule():
    """Test creating a schedule of activities"""
    user_location = {'lat': 55.950231, 'lng': -3.187588}
    start_time = 600  # 10:00 AM in minutes

    # Get activities from find_activities
    result = find_activities()

    if result.get("status") != "ok" or not result.get('activities'):
        print("✗ Cannot create schedule without activities")
        return

    activities = result['activities']
    print(f"✓ Found {len(activities)} activities to schedule")

    travel_mode = result['choices'].get('travel_mode', 'WALK')

    durations = ['short', 'medium', 'long']

    for duration in durations:
        print(f"Testing '{duration}' duration")

        try:
            schedule = create_schedule(
                duration=duration,
                results=activities,
                start_time=start_time,
                user_location=user_location
                ,travel_mode=travel_mode
            )

            total_minutes = calculate_date_duration(duration)
            print(f"Duration limit: {total_minutes} minutes ({total_minutes / 60:.1f} hours)")
            print(f"Activities scheduled: {len(schedule)}")

            if schedule:
                total_time_used = 0
                for i, item in enumerate(schedule, 1):
                    start_hours = item['start_time'] // 60
                    start_mins = item['start_time'] % 60

                    travel_time = item['travel_time']
                    total_time_used += travel_time + item['duration']

                    print(f"\n  Activity {i}: {item['venue']['name']}")
                    print(f"    Start:  {start_hours:02d}:{start_mins:02d}")
                    print(f"    Duration: {item['duration']} mins")
                    print(f"    Travel time: {travel_time} mins")
                    print(f"    Types: {', '.join(item['venue']['types'][:3])}")

                print(f"\n  Total time used: {total_time_used} / {total_minutes} minutes")
                print(f"  Time remaining: {total_minutes - total_time_used} minutes")

            else:
                print("  No activities could be scheduled")

        except Exception as e:
            print(f"✗ Error creating schedule: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    # print("Testing route calculation...\n")
    # test_calculate_route()

    print("\nTesting travel modes...\n")
    test_travel_modes()
    print("Testing find_activities in Edinburgh...\n")
    test_find_activities_edinburgh()
    print("\nTesting create_schedule...\n")
    test_create_schedule()
