from flask import Blueprint, request, jsonify # type: ignore
from models import db
from models.dbmodels import UsersTable, Expenses
from flask_jwt_extended import jwt_required, get_jwt_identity # type: ignore


admin = Blueprint('admin',__name__)

@admin.route('/all-users',methods=['GET'])
@jwt_required()
def get_all_users():

    users = UsersTable.query.all()
    all_users = [
    {
        "user_id": user.id,
        "email": user.email,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "role": user.role  
    }
    for user in users
]

    return jsonify({"all_users": all_users})


@admin.route('/delete-user/<uuid:user_id>',methods=['DELETE'])
@jwt_required()
def delete_user(user_id):

    user = UsersTable.query.get(user_id)
    if not user:
        return jsonify({"error":"User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message":"User deleted successfully"}), 200



        


@admin.route('/all-expenses',methods=['GET'])
@jwt_required()
def get_all_expenses():

    results  =  db.session.query(Expenses, UsersTable).join(UsersTable, Expenses.user_id == UsersTable.id).all()
    all_expenses = [
    {
        "expense_id": expense.id,
        "name": expense.name,
        "category": expense.category,
        "cost": expense.cost,
        "user_id": expense.user_id,
        "user_email": user.email
    }
    for expense,user  in results 
]
    return jsonify({"all_expenses":all_expenses})