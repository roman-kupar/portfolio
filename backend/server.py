from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import os
import platform

# Determine the executable path based on the OS and environment
if os.environ.get('DOCKER_ENV'):
    # In Docker (Linux), we build it to /app/build/chess_engine
    EXE_PATH = "/app/build/chess_engine"
else:
    # Local Windows environment
    EXE_PATH = "out/build/x64-debug/chess_engine.exe"

app = Flask(__name__)

CORS(app)

@app.route('/')
def index():
    return "Test server"

@app.route('/api/isready', methods=['GET'])
def is_ready():
    if os.path.exists(EXE_PATH):
        return jsonify({"readyok": True})

    # Fallback compilation for local dev (Docker builds it in the Dockerfile)
    try:
        commands = [
            "mkdir build",
            "cd build",
            "cmake ..",
            "cmake --build . --config Debug"
        ]

        command_str = " && ".join(commands)
        subprocess.run(command_str, shell=True, check=True, cwd=os.path.dirname(os.path.abspath(__file__)))

        if os.path.exists(EXE_PATH):
            return jsonify({"readyok": True})
        else:
            return jsonify({"readyok": False, "error": "Build completed but executable not found"}), 500
    except subprocess.CalledProcessError as e:
        return jsonify({"readyok": False, "error": f"Build failed: {e}"}), 500

@app.route('/api/move', methods=['POST'])
def move():
    data = request.get_json()
    fen = data.get('fen') if data else None

    if not fen:
        return jsonify({"error": "No FEN provided"}), 400

    print(fen)

    try:
        result = subprocess.run(
            [EXE_PATH, fen],
            capture_output=True,
            text=True,
            check=True
        )
        move_str = result.stdout.strip()

        from_part, to_part = move_str.split(':')        # "r,c:r,c"
        from_r, from_c = map(int, from_part.split(','))
        to_r,   to_c   = map(int,   to_part.split(','))

        print(from_r , from_c)
        print(to_r , to_c)

        return jsonify({
            "move": {
                "from": {"r": from_r, "c": from_c},
                "to":   {"r": to_r,   "c": to_c}
            }
        })
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Engine error: {e.stderr}"}), 500
    except ValueError as e:
        return jsonify({"error": f"Invalid move format: {e}"}), 500

if __name__ == '__main__':
    # Listen on all interfaces (0.0.0.0) so Docker can map the port
    app.run(host='0.0.0.0', port=5000, debug=True)