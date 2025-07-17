import os
from flask import Flask, app
from flask_sqlalchemy import SQLAlchemy # type: ignore
from flask_migrate import Migrate # type: ignore
from flask_cors import CORS # type: ignore
from flask_jwt_extended import JWTManager # type: ignore




#4.Initialize database connection and ORM  
db = SQLAlchemy()
#4.Enable database schema migrations management with flask-migrate
migrate = Migrate(db)


#1.create_app
def create_app():

    #2.create Flask web app
    app = Flask(__name__)



    #3.connect with the db and use SECRET_KEY
    #na tou allaksw thn db
    dbName = 'PersonalFinanceTracker'
    secret_key = 'PrdzVUXphvAlDtKZfgy3123sadasd'

    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:353535@localhost/{dbName}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #not necessary in most cases and uses extra memory
    
    #11 setup for jwt auth
    app.config['JWT_SECRET_KEY'] = f'{secret_key}' # secret key = signature
    app.config['JWT_TOKEN_LOCATION'] = ['cookies'] # only accept tokens from cookies not localstorage
    app.config['JWT_ACCESS_COOKIE_PATH'] = '/' #defines where access token cookie is sent, '/' means will be sent to every request
    app.config['JWT_REFRESH_COOKIE_PATH'] = '/' # limits the refresh token to only be sent with requests to /refresh
    app.config['JWT_COOKIE_SECURE'] = False# this must go True when i finish the app
    app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
    app.config['JWT_REFRESH_COOKIE_NAME'] = 'refresh_token_cookie'
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False #must go true on production
    jwt = JWTManager(app)
    

    

    #9. handle the issue with CORS
#     CORS(app, 
#         resources={
#             r"/auth/*": {
#                 "origins": [
#                 "http://localhost:5173",
#                 "http://127.0.0.1:5173"
#             ],
#                 "methods": ["GET", "POST", "OPTIONS"],
#                 "allow_headers": ["Content-Type", "Authorization"],
#                 "supports_credentials": True
#     }
#   }
# )
    CORS(app, supports_credentials=True)

    #5.after that create the dbmodels 
    #6.binding db to the app and import dbmodels and user
    db.init_app(app)
    from . import dbmodels
    from .dbmodels import UsersTable,Expenses #forgot . 

    

    #7.initialize migrate
    migrate.init_app(app, db)
    # DONT FORGET    flask db init
    #                flask db migrate
    #                flask db upgrade 

    #8. make auth.py
    
    #10. register blueprnt
    from .auth import auth
    app.register_blueprint(auth, url_prefix='/auth')

    from .routes import route
    app.register_blueprint(route, url_prefix='/expense')

    from .admin import admin
    app.register_blueprint(admin, url_prefix="/admin")


    return app