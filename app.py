from flask import Flask

import api

app = Flask(__name__)
app.register_blueprint(api.blue)


if __name__ == '__main__':
    app.run(debug=True)
