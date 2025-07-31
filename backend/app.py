import os
from flask import Flask, app # type: ignore
from flask_sqlalchemy import SQLAlchemy # type: ignore
from flask_migrate import Migrate # type: ignore
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager # type: ignore
from dotenv import load_dotenv # type: ignore



#4.Enable database schema migrations management with flask-migrate
db = SQLAlchemy()
migrate = Migrate() 


#2.create Flask web app
app = Flask(__name__)


load_dotenv()
#3.connect with the db and use SECRET_KEY

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #not necessary in most cases and uses extra memory
    
#11 setup for jwt auth
app.config['JWT_TOKEN_LOCATION'] = ['cookies'] # only accept tokens from cookies not localstorage
app.config['JWT_ACCESS_COOKIE_PATH'] = '/' #defines where access token cookie is sent, '/' means will be sent to every request
app.config['JWT_REFRESH_COOKIE_PATH'] = '/auth/refresh-token' # limits the refresh token to only be sent with requests to /refresh
app.config['JWT_COOKIE_SECURE'] = False# this must go True when i finish the app
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token_cookie'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False #must go true on production
app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # Or 'Strict' / 'None' based on your needs
jwt = JWTManager(app)
    

CORS(app, supports_credentials=True)

#5.after that create the dbmodels 
#6.binding db to the app and import dbmodels and user
from models import db
db.init_app(app)
from models import dbmodels
 
#7.initialize migrate
migrate.init_app(app, db)
# DONT FORGET    flask db init
#                flask db migrate
#                flask db upgrade 

#8. make auth.py
    
#10. register blueprnt
from  routes.auth import auth
app.register_blueprint(auth, url_prefix='/auth')

from routes.routes import route
app.register_blueprint(route, url_prefix='/expense')

from routes.admin import admin
app.register_blueprint(admin, url_prefix="/admin")

if __name__ == "__main__":
    app.run(debug=True)
    