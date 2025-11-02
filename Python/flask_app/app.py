from flask import Flask, render_template, jsonify, request, make_response
from flask_cors import CORS, cross_origin

from Python.flask_app.findActivities import find_activities
from routeRequest import extract_travel_mode
from services.Validation import *
from schedular import create_schedule
from Python.flask_app.storage.store_data import save_choices, clear_choices

app = Flask(__name__)

ALLOWED_ORIGINS = {"http://localhost:3000", "http://127.0.0.1:3000"}

CORS(app, resources={r"/*": {
    "origins": list(ALLOWED_ORIGINS),
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})


# Ensure headers exist on every response (including errors)
@app.after_request
def add_cors_headers(resp):
    origin = request.headers.get("Origin")
    if origin in ALLOWED_ORIGINS:
        resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Vary"] = "Origin"
        resp.headers["Access-Control-Allow-Credentials"] = "true"
        resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        # Echo requested headers so preflight succeeds even with custom headers
        requested = request.headers.get("Access-Control-Request-Headers", "Content-Type, Authorization")
        resp.headers["Access-Control-Allow-Headers"] = requested
    return resp


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


@app.route('/getChoices', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=list(ALLOWED_ORIGINS),
    methods=['POST', 'OPTIONS'],
    allow_headers=['Content-Type', 'Authorization'],
    supports_credentials=True
)
def get_choices():
    # Let CORS preflight succeed
    if request.method == 'OPTIONS':
        return '', 204

    if not request.is_json:
        return jsonify({'error': 'expected JSON body'}), 400

    data = request.get_json()

    # Validate each field using existing services
    coordinates = parse_coords(data)
    if not coordinates:
        return jsonify({'error': 'invalid or missing coordinates'}), 400

    time = parse_time(data)
    if not time:
        return jsonify({'error': 'invalid or missing start_time'}), 400

    categories = parse_categories(data)
    if not categories:
        return jsonify({'error': 'invalid or missing categories'}), 400

    if 'radius' not in data:
        return jsonify({'error': 'missing radius'}), 400

    try:
        radius = int(data['radius'])
    except (ValueError, TypeError):
        return jsonify({'error': 'invalid radius value'}), 400

    travel_mode = data['travel_mode']
    if travel_mode not in ['DRIVE', 'WALK', 'TRANSIT']:
        return jsonify({'error': 'invalid travel_mode'}), 400

    # clear before saving new choices
    clear_choices()
    saved_data = save_choices(coordinates, time, categories, radius, travel_mode)

    return jsonify({'status': 'ok', 'saved': saved_data}), 200


@app.route('/giveActivities', methods=['GET'])
def give_activities():
    activities = find_activities()

    if activities.get("status") != "ok":
        return jsonify(activities), 400

    return jsonify(activities), 200


# ----------------------------------------------------------

# duration = ["short", "medium", "long"]
# results = find_activities()
# activities = results['activities']
# start_time = results['choices']['start_time']
# user_location = results['choices']['coordinates']
# travel_mode = results['choices']['travel_mode']

@app.route('/giveSchedule', methods=['GET', 'OPTIONS'])
def give_schedule():
    if request.method == 'OPTIONS':
        return make_response('', 204)

    results = find_activities()
    if results.get("status") != "ok":
        return jsonify(results), 400

    activities = results['activities']
    start_time = results['choices']['start_time']
    user_location = results['choices']['coordinates']
    travel_mode = results['choices']['travel_mode']

    # Debug logging
    print(f"Found {len(activities)} activities")
    print(f"Start time: {start_time}")
    print(f"User location: {user_location}")
    print(f"Travel mode: {travel_mode}")

    # Generate three schedules for each duration
    schedules = {}
    for duration in ["short", "medium", "long"]:
        print(f"\n=== Creating {duration} schedule ===")
        schedule = create_schedule(
            duration=duration,
            results=activities,
            start_time=start_time,
            user_location=user_location,
            travel_mode=travel_mode
        )
        print(f"{duration} schedule has {len(schedule)} activities")
        schedules[duration] = schedule

    return jsonify({"status": "ok", "schedules": schedules}), 200



if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(host='127.0.0.1', port=5050, debug=True)
