from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route('/', methods=['POST'])
def hello_world_post():
    data = request.json
    print(data['asdf'])
    data['res'] = "123"

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
