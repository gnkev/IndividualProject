
from flask import Flask, jsonify, request
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

#todo, fix the bug where when user enters ...?actor= it crashes the app
@app.route('/api/movies')
def get_movies():
    try: 
        title = request.args.get("title")
        actor = request.args.get("actor")
        genre = request.args.get("genre")
        param_count = sum([1 for param in [title, actor, genre] if param is not None])
        connection = getConnection()
        with connection.cursor() as cursor:
            if param_count == 1:
                if title:
                    cursor.execute(f"""SELECT * FROM film f
                                WHERE f.title = '{title}';""")
                    movies = cursor.fetchall()
                    if not movies:
                        return jsonify({"Failed":f"{title} not found"}), 404
                    return jsonify(movies)
                elif actor:
                    if actor == None:
                        return jsonify({"Failed":"Bad Request (No actor name present)"}), 400
                    actorname = actor.split(" ")
                    if len(actorname) != 2:
                        return jsonify({"Failed":"Bad Request (firstname + lastname)"}),400
                    firstname = actorname[0]
                    lastname = actorname[1]
                    print(firstname, lastname)
                    cursor.execute(f"""SELECT f.*, a.first_name , a.last_name  FROM film f
                                       JOIN film_actor fa ON fa.film_id = f.film_id 
                                       JOIN actor a ON a.actor_id = fa.actor_id 
                                       WHERE a.first_name = '{firstname}' AND a.last_name = '{lastname}';""")
                    movies = cursor.fetchall()
                    if not movies:
                        return jsonify({"Failed":f"{actor} not found"}), 404
                    return jsonify(movies),200
                
                elif genre:
                    cursor.execute(f"""SELECT f.*, c.name FROM film f
                                      JOIN film_category fc ON fc.film_id = f.film_id 
                                      JOIN category c ON c.category_id = fc.category_id 
                                      WHERE c.name = '{genre}'""")
                    movies = cursor.fetchall()
                    if not movies:
                        return jsonify({"Failed":f"{genre} not found"}), 404
                    return jsonify(movies)

            
            elif param_count == 0:
                cursor.execute("""
                    select f.film_id, f.title, c.name
                    from sakila.film f, sakila.film_category fc, sakila.category c
                    where f.film_id = fc.film_id and fc.category_id = c.category_id;
                """)
                movies = cursor.fetchall()
                return jsonify(movies), 200
            else:
                return jsonify({"Failed":"Too many arguments"}), 400
            
        connection.close()
    except Exception as e:
        return {'status': 'error', 'message': str(e)},500
    
#todo: Be able to click movie for details


@app.route('/api/actors')
def get_actors(): 
    try:
        actor = request.args.get("actor")

        if not actor or not actor.strip(): 
            return jsonify({"Failed": "No name given"}), 400
        actorname = actor.split(" ") 
        if len(actorname) != 2:
                    return jsonify({"Failed":"Bad Request (firstname + lastname)"}),400
                   
        firstname = actorname[0]
        lastname = actorname[1]

        connection = getConnection()
        with connection.cursor() as cursor: 
            cursor.execute(f"""
                select a.actor_id, a.first_name, a.last_name
	            from sakila.actor a
	            where a.first_name = '{firstname}' AND a.last_name = '{lastname}'
	            
            """)
            actorDetails = cursor.fetchone()

            if not actorDetails: 
                return jsonify({"Failed: {actor} not found"}), 404

        
            
            cursor.execute(f""" 
                    SELECT f.film_id, f.title, COUNT(r.rental_id) as rental_count 
                    FROM sakila.film f, sakila.rental r, sakila.inventory i, sakila.film_actor fa, sakila.actor a
                    WHERE f.film_id = i.film_id 
                    AND i.inventory_id = r.inventory_id 
                    AND f.film_id = fa.film_id 
                    AND fa.actor_id = a.actor_id 
                    AND a.first_name = '{firstname}' 
                    AND a.last_name = '{lastname}'
                    GROUP BY f.film_id, f.title 
                    ORDER BY rental_count DESC
                    LIMIT 5
            
            """)
            actorTop5Films = cursor.fetchall()
        connection.close()

        result = { "actor": actorDetails,
                    "top 5 films": actorTop5Films
                }
        return jsonify(result), 200 

    except Exception as e:
        print(e)
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
        print(e)
        return {'status': 'error', 'message': str(e)},500


@app.route('/api/users')
def get_all_users():
    try:

        page = request.args.get('page', 1, type=int)
        usersPerPage = request.args.get('usersPerPage',10, type=int)

        offset = (page - 1) * usersPerPage

        conn = getConnection()
        with conn.cursor() as cursor:
            #cursor.execute("""SELECT c.first_name, c.last_name FROM customer c""") 
            #customers = cursor.fetchall()
            cursor.execute("""SELECT COUNT(*) as total FROM customer""")
            totalCustomers = cursor.fetchone()['total']

            cursor.execute(f""" 
                    SELECT c.customer_id, c.first_name, c.last_name, c.email
                    FROM customer c 
                    LIMIT {usersPerPage} OFFSET {offset}         
            """)
            customers = cursor.fetchall()
            
        conn.close()
        totalPages = (totalCustomers + usersPerPage - 1) // usersPerPage

        return jsonify({
            "customers": customers, 
            "pagination": {
                "current_page": page,
                "users_per_page": usersPerPage,
                "total_customers": totalCustomers,
                "total_pages": totalPages,
                "has_next": page < totalPages,
                "has_prev": page > 1 
            }
        }), 200 
    except Exception as e:
        print(e)
        return {'status': 'error', 'message': str(e)},500



if __name__ == '__main__':
    print("Running Flask server...")
    app.run(debug=True, port=5000)
