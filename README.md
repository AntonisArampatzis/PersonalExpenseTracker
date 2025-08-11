# Personal Expense Tracker
---
## Installation

### Folder Structure

```bash

├── frontend/ 
└── backend/ 
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/AntonisArampatzis/PersonalExpenseTracker.git
cd PersonalExpenseTracker

```
---

### 2. Backend Setup

```bash
cd backend
# Create virtual enviroment - optional but recommended
python -m venv venv         
# Activate virtual enviroment
source venv/bin/activate
# or  
venv\Scripts\activate # on Windows
# Install Python dependencies
pip install -r requirements.txt
# Create .env in the project root
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=postgresql://username:password@localhost/db_name
# Start the backend server
flask run
```                 
      

##### Runs on http://127.0.0.1:5000


### 3. PostgreSQL Setup
- [PostgreSQL](https://www.postgresql.org/download/) (v13+ recommended)
- A PostgreSQL user with a password
- A database created for this project
> ⚠️ During installation, note your **username** and **password** — you’ll need them later.

####  Create a new database

Open the terminal or pgAdmin and run:

```sql
CREATE DATABASE PersonalExpenseTracker;
```
---
### 4. Frontend Setup

```bash
cd ../frontend
npm install        
npm run dev        
```
##### Start the frontend dev server, runs on http://localhost:5173
---

### ⚙️ Prerequisites

Make sure the following are installed on your system before running the project:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- [Python](https://www.python.org/) (v3.10+ recommended)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/) 
---

## Admin Setup

This project supports two user roles: **Admin** and **User**.

To create an **Admin** user, you need to send a POST request to the backend registration endpoint using [Postman](https://www.postman.com/) or any API client.

### How to create an Admin user

- **Endpoint:** `http://127.0.0.1:5000/auth/register`  
- **Method:** `POST`  
- **Headers:**  
  - `Content-Type: application/json`

- **Request Body JSON:**

```json
{
  "email": "admin@gmail.com",
  "firstName": "admin",
  "lastName": "admin",
  "password1": "11111",
  "password2": "11111",
  "role": "Admin"
}
```

## UI Libraries Used

This project uses the following UI libraries:

- [MUI (Material UI)](https://mui.com/)

These are already included in `package.json` and they are already installed during 4. Frontend setup.


