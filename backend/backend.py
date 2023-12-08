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
  database="project1CS485"
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
);
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
);
"""

create_test_tasks = """
INSERT INTO task(id, name, description, sort_field, created_at, updated_at)
VALUES ("1", "task1", "a task", 0, CURDATE(), CURDATE()),
("2", "task2", "some task", 1, CURDATE(), CURDATE()),
("3", "task3", "yet another task", 2, CURDATE(), CURDATE());
"""

globalCursor.execute(create_task_sql)
globalCursor.execute(create_comment_sql)
globalCursor.execute(create_test_tasks)

db.commit()
globalCursor.close()

@app.route('/api/task/create', methods=['POST'])
def create():
  name = request.json['name']
  description = request.json['description']

  cursor = db.cursor()
  db.commit()

  try:
    task_id = None
    while not task_id:
        task_id = str(uuid.uuid4())
        sql = "SELECT id FROM task WHERE id = %s"
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
    print(f"Inserted {values}")
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
def get_tasks():
  cursor = db.cursor()
  db.commit()

  try:
    sql = "SELECT id, name, description, sort_field, created_at, updated_at, deleted_at FROM task"
    cursor.execute(sql)
    tasks = cursor.fetchall()
    print(f"Tasks: {tasks}")
    tasks = [{
      "id": task[0],
      "task_name": task[1],
      "description": task[2],
      "sort_field": task[3],
      "created_at": task[4],
      "updated_at": task[5]
    } for task in tasks]
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

@app.route('/api/tasks/updateorder', methods=['POST'])
def update_order():
  new_sort_fields = request.json['new_sort_fields']

  cursor = db.cursor()
  db.commit()

  try:
    tasks = None
    for new_sort_field in new_sort_fields:
      task_id = new_sort_field[0]
      sort_field = new_sort_field[1]
      sql = "UPDATE task SET sort_field=%s WHERE id=%s"
      values = (task_id, sort_field)
      cursor.execute(sql, values)
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
  app.run(port=5000, debug=True)