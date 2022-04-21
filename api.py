from flask import Blueprint, request, jsonify

blue = Blueprint('api', __name__, url_prefix='/api')

@blue.route('', methods=['POST'])
def hello_world_post():
    data = request.json
    data['res'] = '123'

    return jsonify(data)
