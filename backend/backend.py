from flask import Flask, request, jsonify
import mysql.connector
import os
import uuid
import traceback
from flask_cors import CORS
from datetime import date

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
  host="localhost",
  user="root",
  password=os.environ.get("DB_PASS"),
  database="485project1"
)

globalCursor = db.cursor()

globalCursor.execute("DROP TABLE IF EXISTS `comment`")
globalCursor.execute("DROP TABLE IF EXISTS `task`")

create_task_sql = """
CREATE TABLE task (
    id varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    sort_field int NOT NULL,
    created_at varchar(255) NOT NULL,
    updated_at varchar(255) NOT NULL,
    deleted_at varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
)
"""

create_comment_sql = """
CREATE TABLE comment (
    id varchar(255) NOT NULL,
    task_comment varchar(255) NOT NULL,
    task_id varchar(255) NOT NULL,
    created_at varchar(255) NOT NULL,
    updated_at varchar(255) NOT NULL,
    deleted_at varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (task_id) REFERENCES task(id)
)
"""

globalCursor.execute(create_task_sql)
globalCursor.execute(create_comment_sql)

db.commit()
globalCursor.close()

@app.route('/api/task/create', methods=['POST'])
def register():
  name = request.json['username']
  description = request.json['password']

  cursor = db.cursor()
  db.commit()

  try:
    task_id = None
    while not task_id:
        task_id = uuid.uuid4()
        sql = "SELECT task_id FROM task WHERE task_id = %s"
        values = (task_id,)
        cursor.execute(sql, values)
        task_id = cursor.fetchone()

    sql = "SELECT MAX(sort_field) FROM task"
    values = (task_id,)
    sort_field = cursor.fetchone()
    if sort_field:
      sort_field += 1
    else:
      sort_field = 0

    today = date.today()
    today_sql = f"{today.year}-{today.month}-{today.day}"

    sql = "INSERT INTO task (id, name, description, sort_field, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)"
    values = (task_id, name, description, sort_field, today_sql, today_sql)
    cursor.execute(sql, values)

    db.commit()

    response = {
      "status": "success"
    }
    return jsonify(response), 200
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/tasks', methods=['GET'])
def register():
  cursor = db.cursor()
  db.commit()

  try:
    sql = "SELECT name, description, sort_field, created_at, updated_at, deleted_at FROM TASKS"
    cursor.execute(sql)
    tasks = cursor.fetchall()
    print(f"Tasks: {tasks}")

    return jsonify(tasks), 200
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

if __name__ == '__main__':
  app.run(port=5000)