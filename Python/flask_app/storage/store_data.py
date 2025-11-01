import json
import os
from pathlib import Path

DATA_FILE = Path(__file__).parent / "user_choices.json"


def save_choices(coordinates, time, categories, radius, travel_mode):
    """Save all user choices to a JSON file."""
    data = {
        "coordinates": coordinates,
        "start_time": time,
        "categories": categories,
        "radius": radius,
        "travel_mode": travel_mode
    }

    os.makedirs(DATA_FILE.parent, exist_ok=True)

    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    return data


def load_choices():
    """Load saved user choices from JSON file."""
    if not DATA_FILE.exists():
        return None

    with open(DATA_FILE, 'r') as f:
        return json.load(f)


def clear_choices():
    """Remove saved choices file."""
    if DATA_FILE.exists():
        os.remove(DATA_FILE)
