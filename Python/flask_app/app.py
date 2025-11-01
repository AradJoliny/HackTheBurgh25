from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

from Python.flask_app.findActivities import find_activities
from Python.flask_app.services.Validation import *
from Python.flask_app.storage.store_data import save_choices

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


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

    # Save to file
    saved_data = save_choices(coordinates, time, categories, radius)

    return jsonify({'status': 'ok', 'saved': saved_data}), 200


if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(debug=True)
