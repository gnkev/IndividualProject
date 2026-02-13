
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
        connection = getConnection()
        with connection.cursor() as cursor: 
            cursor.execute("SELECT DATABASE()")
            result = cursor.fetchone()
        connection.close() 
        return {'status': 'success', 'database': result }, 200
    except Exception as e: 
        return {'status': 'error', 'message': str(e) }, 500

@app.route('/api/movies')
def get_movies():
    try: 
        connection = getConnection()
        with connection.cursor() as cursor:
            cursor.execute("""
                 select f.film_id, f.title, c.name
                 from sakila.film f, sakila.film_category fc, sakila.category c
                where f.film_id = fc.film_id and fc.category_id = c.category_id;
            """)
            movies = cursor.fetchall()
        connection.close()
        return jsonify(movies), 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)},500
    
@app.route('/api/top5movies')
def get_top5():
    try:
        conn = getConnection()
        with conn.cursor() as cursor:
            cursor.execute("""SELECT f.film_id, f.title, c.name, COUNT(r.rental_id) FROM film f
                            JOIN film_category fc ON fc.film_id = f.film_id 
                            JOIN category c ON fc.category_id = c.category_id 
                            JOIN inventory i ON f.film_id = i.film_id 
                            JOIN rental r ON i.inventory_id = r.inventory_id 
                            GROUP BY f.film_id, f.title, c.name 
                            ORDER BY COUNT(r.rental_id) DESC 
                            LIMIT 5""")
            movies = cursor.fetchall()
        cursor.close()
        return jsonify(movies), 200
    except Exception as e:
        return {'status': 'error', 'message': str(e)},500

'''
Top 5 movies 
SELECT f.film_id, f.title, c.name, COUNT(r.rental_id) FROM film f
JOIN film_category fc ON fc.film_id = f.film_id 
JOIN category c ON fc.category_id = c.category_id 
JOIN inventory i ON f.film_id = i.film_id 
JOIN rental r ON i.inventory_id = r.inventory_id 
GROUP BY f.film_id, f.title, c.name 
ORDER BY COUNT(r.rental_id) DESC 
LIMIT 5
'''


if __name__ == 'main':
    print("Running Flask server...")
    app.run(debug=True, port=5000)
