from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

#from Python.flask_app.findActivities import find_activities
from findActivities import find_activities
from routeRequest import extract_travel_mode
from services.Validation import *
from schedular import create_schedule
from storage.store_data import save_choices, clear_choices

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


# saving user choices
@app.route('/getChoices', methods=['POST'])
def get_choices():
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


# generating schedules based on saved choices
@app.route('/giveSchedules', methods=['POST'])
def give_schedule():
    durations = ["short", "medium", "long"]
    results = find_activities()
    activities = results['activities']
    start_time = results['choices']['start_time']
    user_location = results['choices']['coordinates']
    travel_mode = extract_travel_mode(results['choices'])

    schedules = []
    for duration in durations:
        schedule = create_schedule(duration=duration, results=activities, start_time=start_time,
                                   user_location=user_location, travel_mode=travel_mode)

        if schedule.get("status") != "ok":
            return jsonify(schedule), 400

        schedules.append(schedule)

    return jsonify(schedules), 200


if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(debug=True)
