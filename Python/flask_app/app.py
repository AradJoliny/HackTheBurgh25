from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # For development only. Use a proper WSGI server in production.
    app.run(debug=True)

