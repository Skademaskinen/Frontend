from subprocess import check_output
import json
from multiprocessing import Lock

db = "db.db3"

lock = Lock()

init_db = lambda: check_output([
    "sqlite3", 
    db,
    'create table if not exists guestbook (id INTEGER PRIMARY KEY, username VARCHAR, message VARCHAR, likes INTEGER)'
])

def add(username, message):
    print(username)
    print(message)
    lock.acquire()
    init_db()
    check_output([
        "sqlite3", 
        db,
        f"insert into guestbook (username, message, likes) values ('{username}', '{message}', {0})"
    ])
    lock.release()

def get(id):
    print(id)
    lock.acquire()
    init_db()
    data = json.loads(check_output([
        "sqlite3", 
        db, 
        f'select username,message,likes from guestbook where id = {id}',
        "-json"
    ]).decode())[0]
    lock.release()
    return {"username":data["username"], "message":data["message"], "likes":data["likes"]}

def delete(id):
    print(id)
    lock.acquire()
    init_db()
    check_output([
        "sqlite3",
        db,
        f'delete from guestbook where id = {id}'
    ])
    lock.release()

def like(id):
    print(id)
    lock.acquire()
    init_db()
    check_output([
        "sqlite3",
        db,
        f'update guestbook set likes = {check_output(["sqlite3",db,f"select likes from guestbook where id = {id}"]).decode()} where id = {id}'
    ])
    lock.release()

def getIds():
    lock.acquire()
    init_db
    data = [row["id"] for row in json.loads(check_output([
        "sqlite3",
        db, 
        "select id from guestbook",
        "-json"
    ]).decode())]
    lock.release()
    return data