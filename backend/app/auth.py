from flask import Blueprint, request, jsonify, make_response
from . import db
from .dbmodels import UsersTable
from werkzeug.security import generate_password_hash, check_password_hash # type: ignore
from flask_jwt_extended import create_access_token,create_refresh_token,jwt_required, get_jwt_identity,set_access_cookies, set_refresh_cookies # type: ignore
from datetime import timedelta

#1 make auth Blueprint
auth = Blueprint('auth',__name__)



#2 make routes 
@auth.route('/login', methods=['POST'])
def login_api():

    try:

        #3 get data from frontend
        login_data = request.get_json()

        #4 validation if data were sent by frontend
        if not login_data:
            return jsonify({"error":"No data sent to backend"}), 400
        


        #5 save the data in specific variables
        email = login_data.get('email','').strip()
        password = login_data.get('password','').strip()

        #6 validation for the data again
        if not email:
            return jsonify({"error":"Email cannot be empty!"}), 400
        if not password:
            return jsonify({"error":"Password cannot be empty!"}), 400
        


        #7 query the db to search user with this email
        user = UsersTable.query.filter_by(email=email).first()

        #8 check if email passowrd from frontend match the db ones
        if user and check_password_hash(user.password, password):#(hashed.passoword in db, current password sent from frontend)
            # both tokens here signed with this identity user.id

            #the expires_delta must be the same with max_age in response.set_cookie
            access_token = create_access_token(identity=str(user.user_id), expires_delta=timedelta(minutes=10))# ***
            refresh_token = create_refresh_token(identity=str(user.user_id), expires_delta=timedelta(days=30))# ***!
        


        # Create response 
            response = make_response(jsonify({
                "message": "Logged In Successfully!",
                "logged_user": user.email,
                "role": user.role
            }))
            set_access_cookies(response, access_token)
            set_refresh_cookies(response, refresh_token)
            
                
            return response, 200
        else:
            if not user:
                return jsonify({"error":"Incorrect email!"}), 400
            else:
                return jsonify({"error":"Incorrect password!"}), 400
        

        
        #9 if error occurs in try this will send a cleaner message and will prever app from crashing
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": "Server error"}), 400
    




@auth.route('/register', methods=['POST'])
def singup_api():

    try:
        #1 get data from frontend
        signup_data = request.get_json()

        #2 validation if data sent from frontend
        if not signup_data:
            return jsonify({"error":"No data sent to backend"}), 400
        

        #3 save the sata in seperate variables
        email = signup_data.get('email','').strip()
        firstName = signup_data.get('firstName','').strip()
        lastName = signup_data.get('lastName','').strip()
        password1 = signup_data.get('password1', '').strip()
        password2 = signup_data.get('password2', '').strip()
        # Used only to create admin with postman
        role = signup_data.get('role','').strip()

        #4 validation if each field wasnt empty
        if not email:
            return jsonify({"error":"Email field cannot be empty!"}), 400
        
        if not firstName:
            return jsonify({"error":"First name field cannot be empty"}), 400
        
        if not lastName:
            return jsonify({"error":"Last name field cannot be empty"}), 400
        
        if not password1:
            return jsonify({"error":"Password field cannot be empty"}), 400
        
        # if len(password1) <= 5:
        #         return jsonify({"error": "Password must be longer than 5 characters"}), 400

        # # Check if password contains at least one special character
        # if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password1):
        #     return jsonify({"error": "Password must contain at least one special character"}), 400
        
        if not password2:
            return jsonify({"error": "Confirm Password field cannot be empty!"}), 400
        


        #5 query the db for that email
        user = UsersTable.query.filter_by(email=email).first()

        #6 check if the email is already in use
        if user:
            return jsonify({"error":"This email is already in use!"}), 400
        
        #6 check if passwords match
        if password1 != password2:
            return jsonify({"error":"Passwords do not match!"}), 400
        
        

        #7 create new user and respond with success
        new_user = UsersTable(
        email=email,
        firstName=firstName,
        lastName=lastName,
        password=generate_password_hash(password1, method='pbkdf2:sha256'),
        role=role
        )
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message":"Account created successfully!"}), 200
        
        
        #8 if error occurs in try this will send a cleaner message and will prever app from crashing
    except Exception as e:#if error occurs in try this will send a cleaner message and will prever app from crashing
        print(f"Exception: {e}")
        return jsonify({"error": "Server error"}), 500
        





#logout is the same with the way i create the access_token and refresh_token in login but change max_age to 0(it was 10 minutes and 30days for each)
@auth.route('/logout', methods=['POST'])
def logout_api():
    
    response = make_response(jsonify({"message": "Logged out successfully"}))
    
    # Remove access token cookie
    response.set_cookie(
        key='access_token_cookie',
        value='',
        httponly=True,
        path='/',
        secure=False,     
        samesite='Lax',
        max_age=0
    )

    # Remove refresh token cookie too if you have it
    response.set_cookie(
        key='refresh_token_cookie',
        value='',
        httponly=True,
        path='/',
        secure=False,
        samesite='Lax',
        max_age=0
    )

    return response, 200



@auth.route('/verify-token', methods=['GET'])
@jwt_required()
#jwt required guarantees a valid token with identity exists,no if statement neeeded anywhere
def verify_token():
    try:
        ##get the identity of the token,this identity declared in (access_token = create_access_token(identity=user.id,)
        current_user = get_jwt_identity()
        user = UsersTable.query.filter_by(user_id=current_user).first()
        return jsonify({"message": "Token verified and is valid", "user_id": current_user,"role": user.role}), 200
    except Exception as e:
        print(f"Token verification error: {e}")
        return jsonify({"error": "Invalid token"}), 401
    

#keep users logged in after the access token expires refreshing the access token if the refresh token isnt expired too
#app.config['JWT_TOKEN_LOCATION'] = ['cookies'] checks for the refresh token in the cookies, because of config
@auth.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)#refresh=True only if valid refresh_token
def refresh_token():
    try:
        #get the identity of the token,this identity declared in (access_token = create_access_token(identity=user.id,)
        current_user = get_jwt_identity()
        #make a new access_token(like the first time in the user and checkuserpassword in login)
        new_access_token = create_access_token(identity=current_user, expires_delta=timedelta(minutes=5))

        #make a response json for front 
        response = make_response(jsonify({"message": "Access token refreshed"}))
        #make a cookie again like in login
        set_access_cookies(response, new_access_token)
        # response.set_cookie(
        #     key="access_token_cookie",
        #     value=new_access_token,
        #     httponly=True,
        #     secure=False,
        #     samesite="Lax",
        #     max_age=10 * 60
        # )
        return response, 200

    except Exception as e:
        print(f"Refresh error: {e}")
        return jsonify({"error": "Token refresh failed"}), 401