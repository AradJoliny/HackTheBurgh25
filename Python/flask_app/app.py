from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

from Python.flask_app.services.CoordsService import parse_coords

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

if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(debug=True)
