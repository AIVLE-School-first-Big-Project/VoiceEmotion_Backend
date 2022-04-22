import os

from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

UPLOAD_DIRECTORY = './tmp'

if not os.path.exists(UPLOAD_DIRECTORY):
    os.mkdir(UPLOAD_DIRECTORY)

app = Flask(__name__)


@app.route('/receive', methods=['post'])
def form():
    file = request.files['file']
    filename = secure_filename(file.filename)
    app.logger(filename)
    file.save(os.path.join(UPLOAD_DIRECTORY, filename))
    return 'hello'


@app.route('/', methods=['GET'])
def hello():
    return render_template('index.html')


if __name__ == '__main__':
    app.run()
