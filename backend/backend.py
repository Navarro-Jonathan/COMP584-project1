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
VALUES ("1", "task1", "a task", 1, CURDATE(), CURDATE()),
("2", "task2", "some task", 2, CURDATE(), CURDATE()),
("3", "task3", "yet another task", 3, CURDATE(), CURDATE());
"""

globalCursor.execute(create_task_sql)
globalCursor.execute(create_comment_sql)
globalCursor.execute(create_test_tasks)

db.commit()
globalCursor.close()

MIN_SORT_FIELD_VAL = 1

@app.route('/api/task/create', methods=['POST'])
def create():
  name = request.json['name']
  description = request.json['description']
  print(f"Creating task {name} {description}")

  cursor = db.cursor()
  db.commit()


  try:
    task_id = None
    found = 1
    while found:
        task_id = str(uuid.uuid4())
        sql = "SELECT id FROM task WHERE id = %s"
        values = (task_id,)
        cursor.execute(sql, values)
        found = cursor.fetchone()
        db.commit()

    sql = "SELECT MAX(sort_field) FROM task"
    cursor.execute(sql)
    sort_field = cursor.fetchone()
    print(f"Largest sort_field found: {sort_field}")
    if sort_field:
      sort_field = sort_field[0] + 1
    else:
      sort_field = MIN_SORT_FIELD_VAL

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

def get_tasks_query(cursor):
  sql = "SELECT id, name, description, sort_field, created_at, updated_at, deleted_at FROM task"
  cursor.execute(sql)
  tasks = cursor.fetchall()
  db.commit()
  tasks = [{
    "id": task[0],
    "task_name": task[1],
    "description": task[2],
    "sort_field": task[3],
    "created_at": task[4],
    "updated_at": task[5]
  } for task in tasks]
  return tasks

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
  cursor = db.cursor()
  db.commit()

  try:
    tasks = get_tasks_query(cursor)
    cursor.close()
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

@app.route('/api/tasks/updateorder', methods=['POST'])
def update_order():
  current_position = request.json['old_index'] + 1
  target_position = request.json['new_index'] + 1

  cursor = db.cursor()
  db.commit()

  if target_position == current_position:
    print(f"target and current were both {current_position}")
    tasks = get_tasks_query(cursor)
    return jsonify(tasks), 200

  try:
    # find direction
    going_down = target_position > current_position

    # get id of the moved task
    sql = "SELECT id FROM task WHERE sort_field = %s"
    values = (current_position, )
    cursor.execute(sql, values)
    task_id = cursor.fetchone()
    print(f'task at sort_field {current_position} has id {task_id}')
    db.commit()
    if not task_id:
      return jsonify({"status": "failed"}), 500
    task_id = task_id[0]

    # set sort_field to 0 for the task
    sql = "UPDATE task SET sort_field = 0 WHERE sort_field = %s AND id = %s"
    values = (current_position, task_id)
    cursor.execute(sql, values)
    db.commit()

    # move everything else accordingly
    if going_down:
      sql = "UPDATE task SET sort_field = (sort_field - 1) WHERE sort_field > %s AND sort_field <= %s"
      values = (current_position, target_position)
      cursor.execute(sql, values)
      db.commit()
    else:
      sql = "UPDATE task SET sort_field = (sort_field + 1) WHERE sort_field >= %s AND sort_field < %s"
      values = (target_position, current_position)
      cursor.execute(sql, values)
      db.commit()

    # set the moved task's sort_field
    sql = "UPDATE task SET sort_field = %s WHERE sort_field = 0 AND id = %s"
    values = (target_position, task_id)
    cursor.execute(sql, values)
    db.commit()

    tasks = get_tasks_query(cursor)
    print(f"Updated orders: {tasks}")
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

@app.route('/api/task/delete', methods=['POST'])
def delete_task():
  task_id = request.json['comment_ids']

  cursor = db.cursor()
  db.commit()

  try:
    today = date.today()
    today_sql = f"{today.year}-{today.month}-{today.day}"
    sql = "UPDATE task SET deleted_at = %s WHERE id = %s"
    values = (today_sql,task_id)
    cursor.execute(sql, values)
    db.commit()

    sql = "UPDATE comment SET deleted_at = %s WHERE task_id = %s"
    values = (today_sql,task_id)
    cursor.execute(sql, values)
    db.commit()

    return jsonify({"status": "success"}), 200
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/comments', methods=['GET'])
def get_comments():
  cursor = db.cursor()
  db.commit()

  try:
    sql = "SELECT id, task_id, task_comment, created_at, updated_at, deleted_at FROM comment"
    cursor.execute(sql)
    comments = cursor.fetchall()
    db.commit()
    comments = [{
      "id": comment[0],
      "task_id": comment[1],
      "task_comment": comment[2],
      "created_at": comment[3],
      "updated_at": comment[4],
      "deleted_at": comment[5]
    } for comment in comments]
    return jsonify(comments), 200
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/comment/create', methods=['POST'])
def create_comment():
  task_id = request.json['task_id']
  comment = request.json['comment']

  cursor = db.cursor()
  db.commit()

  try:
    # generate a comment id
    comment_id = None
    found = 1
    while found:
        comment_id = str(uuid.uuid4())
        sql = "SELECT id FROM task WHERE id = %s"
        values = (comment_id,)
        cursor.execute(sql, values)
        found = cursor.fetchone()
        db.commit()

    today = date.today()
    today_sql = f"{today.year}-{today.month}-{today.day}"

    sql = "INSERT INTO task (id, task_id, comment, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)"
    values = (comment_id, task_id, comment, today_sql, today_sql)
    cursor.execute(sql, values)
    db.commit()

    return jsonify({"status": "success"}), 200
  except Exception as e:
    # Unique modifier prevents duplicate username/email
    print(e)
    print(traceback.format_exc())
    response = {
      "status": "failed",
      "message": "An exception occured"
    }
    return jsonify(response), 500

@app.route('/api/comment/delete', methods=['POST'])
def delete_comment():
  comment_id = request.json['comment_id']

  cursor = db.cursor()
  db.commit()

  try:
    today = date.today()
    today_sql = f"{today.year}-{today.month}-{today.day}"
    sql = "UPDATE comment SET deleted_at = %s WHERE comment_id = %s"
    values = (today_sql,comment_id)
    cursor.execute(sql, values)
    db.commit()

    return jsonify({"status": "success"}), 200
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