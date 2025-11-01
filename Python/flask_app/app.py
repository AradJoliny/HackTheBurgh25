from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

from Python.flask_app.services.CoordsService import parse_coords
from Python.flask_app.services.TimeService import parse_time
from Python.flask_app.services.ActivityService import parse_categories

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200


@app.route('/getstartCoordinates', methods=['GET', 'POST'])
def start_coordinates():
    # POST JSON body
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'expected JSON body'}), 400
        data = request.get_json()
        coordinates = parse_coords(data)
        if not coordinates:
            return jsonify({'error': 'invalid or missing coordinates'}), 400
        return jsonify(coordinates), 200

    return jsonify({'error': 'GET method not supported'}), 405

@app.route('/getStartTime', methods=['GET','POST'])
def start_time():
    # POST JSON body
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'expected JSON body'}), 400
        data = request.get_json()
        time = parse_time(data)
        if not time:
            return jsonify({'error': 'missing start_time'}), 400
        return jsonify({'start_time': start_time}), 200

    return jsonify({'error': 'GET method not supported'}), 405


@app.route('/getRadius', methods=['GET', 'POST'])
def get_radius():
    # POST JSON body
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'expected JSON body'}), 400
        data = request.get_json()
        if 'radius' not in data:
            return jsonify({'error': 'missing radius'}), 400
        try:
            radius = int(data['radius'])
            return jsonify({'radius': radius}), 200
        except (ValueError, TypeError):
            return jsonify({'error': 'invalid radius value'}), 400

    return jsonify({'error': 'GET method not supported'}), 405

@app.route('/getCategories', methods=['GET', 'POST'])
def get_categories():
    #POST JSON body
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'expected JSON body'}), 400
        data = request.get_json()
        categories = parse_categories(data)
        if not categories:
            return jsonify({'error': 'missing categories'}), 400
        return jsonify({'categories': categories}), 200


if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(debug=True)
