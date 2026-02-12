from flask import Flask, jsonify
from flask_cors import CORS 
from dotenv import load_dotenv
import os
import pymysql

load_dotenv()

print("Starting Flask app...") 

app = Flask(__name__)
CORS(app)


def getConnection():
    connection = pymysql.connect(
        host=os.getenv('dbHost', 'localhost'),
        user=os.getenv('dbUser', 'root'),
        password=os.getenv('dbPassword'),
        database=os.getenv('dbName', 'sakila'),
        port=int(os.getenv('dbPort', '3306')),
        cursorclass=pymysql.cursors.DictCursor
    )
    return connection



@app.route('/')
def home():
    return {'message': 'Backend is working'}, 200



@app.route('/api/testDB')
def test_DB():
    try: 
        connection = get_db_connection()
        with connection.cursor() as cursor: 
            cursor.executre("SELECT DATABASE()")
            result = cursor.fetchone()
        connection.close() 
        return {'status': 'success', 'database': result }, 200
    except Exception as e: 
        return {'status': 'error', 'message': str(e) }, 500

@app.route('/api/movies')
def get_movies():
    try: 
        connection: get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                 SELECT film_id, title, description, release_year, 
                       rental_rate, length, rating
                FROM film
                LIMIT 20
            """)
            movies = cursor.fetchall()
        connection.close()
        return jsonify(fake_movies), 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)},500

if __name__ == '__main__':
    print("Running Flask server...")
    app.run(debug=True, port=5000)