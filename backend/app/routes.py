from flask import Blueprint, request, jsonify
from . import db
from .dbmodels import UsersTable, Expenses
from flask_jwt_extended import jwt_required, get_jwt_identity # type: ignore

route = Blueprint('route',__name__)

@route.route('/userinfo',methods=['GET'])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    user = UsersTable.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "email": user.email,
    }), 200



@route.route('/add-expense', methods=['POST'])
@jwt_required()
def add_expense():

    # Get current user id from the jwt
    current_user = get_jwt_identity()

    try:
        expense_data = request.get_json()
        if not expense_data:
            return jsonify({"error":"No data found"}), 400
    
        name = expense_data.get('name')
        category = expense_data.get('category')
        cost = expense_data.get('cost')

        new_expense = Expenses(name=name,category=category,cost=cost,user_id=current_user)
        db.session.add(new_expense)
        db.session.commit()

        return jsonify({"message":"New expense added successfully"}),200
    
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": "Server error"}), 400
    


@route.route('/get-expenses',methods=['GET'])
@jwt_required()
def get_expenses():

    # Get the current user's ID from the JWT
    current_user = get_jwt_identity()

    # Query the database for the user with this ID
    user = UsersTable.query.get(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Retrieve all expenses associated with this user
    expenses = Expenses.query.filter_by(user_id=user.user_id).all()

    # Format the expenses into a list
    expenses_data = [
        {
            "expense_id": str(exp.expense_id),
            "name": exp.name,
            "category": exp.category,
            "cost": exp.cost
        }
        for exp in expenses
    ]

    # Return the list of expenses as a JSON response
    return jsonify(expenses_data), 200


@route.route('/delete-expense/<uuid:expense_id>',methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):

    expense = Expenses.query.get(expense_id)
    if not expense:
        return jsonify({"error":"Expense not found"}), 404
    
    db.session.delete(expense)
    db.session.commit()
    return jsonify({"message":"Expense delete successfully"}), 200



        

    