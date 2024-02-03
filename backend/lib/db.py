from sys import argv
import os
from subprocess import check_output
import bcrypt
from json import loads
from secrets import token_urlsafe

db = argv[argv.index("--db")+1] if "--db" in argv else "/tmp/skademaskinen.db3"
with open(argv[argv.index("--keyfile")+1] if "--keyfile" in argv else argv[argv.index("-kf")+1] if "-kf" in argv else "/tmp/skademaskinen-keyfile", "r") as file:
    MASTERKEY = file.read()

sqlite3 = os.getenv("SQLITE3_PATH") if not os.getenv("SQLITE3_PATH") == None else "sqlite3"

doSQL = lambda sql, args=[]: check_output([
    sqlite3,
    db,
    sql
] + args).decode()

class Database:
    def __init__(self) -> None:
        doSQL("create table if not exists users (username varchar primary key, password varbinary not null, salt varbinary not null)")
        doSQL("create table if not exists tokencache (token varchar primary key, username varchar, foreign key(username) references users (username))")
        doSQL("create table if not exists guestbook (id integer primary key, name varchar not null, time integer not null, message varchar not null)")

    def addUser(self, username:str, password:str) -> bool:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(password.encode() + salt + MASTERKEY.encode(), salt)
        if not doSQL(f"select * from users where username = '{username}'") == "":
            return False
        doSQL(f"insert into users values('{username}', '{hash.decode()}', '{salt.decode()}')")
        return True

    def verifyUser(self, username:str, password:str) -> bool:
        if doSQL(f"select * from users where username = '{username}'") == "":
            return False
        data:dict[str, str] = loads(doSQL(f"select * from users where username = '{username}'", ["-json"]))[0]
        hash = bcrypt.hashpw(password.encode() + data["salt"].encode() + MASTERKEY.encode(), data["salt"].encode())
        return hash == data["password"].encode()
    
    def getToken(self, username:str) -> str:
        if doSQL(f"select * from tokencache where username = '{username}'") == "":
            token = token_urlsafe(32)
            doSQL(f"insert into tokencache values ('{token}', '{username}')")
            return token
        else:
            return loads(doSQL(f"select token from tokencache where username = '{username}'", ["-json"]))[0]["token"]
        
    def getTimestamps(self, name:str) -> list[int]:
        data = doSQL(f"select time from guestbook where name = '{name}'", ["-json"])
        if not data == "":
            json = [row["time"] for row in loads(data)]
        else:
            json = []
        return json

    def appendGuestbook(self, name:str, time:int, message:str) -> bool:
        try:
            doSQL(f"insert into guestbook (name, time, message) values ('{name}', {time}, '{message}')")
            return True
        except Exception as e:
            print(e)
            return False
        
    def getGuestbookData(self, id:int) -> (str, int, str):
        data = doSQL(f"select name, time, message from guestbook where id = {id}", ["-json"])
        if not data == "":
            json = loads(data)[0]
        else:
            json = {"name":"Error", "time":0, "message":"Error!"}
        return json["name"], json["time"], json["message"]
    
    def getGuestbookIds(self) -> list[int]:
        data = doSQL(f"select id from guestbook", ["-json"])
        if not data == "":
            json = [row["id"] for row in loads(data)]
        else:
            json = []
        return json



if __name__ == "__main__":
    print(doSQL("create table if not exists test (test varchar)"))
    print(doSQL("insert into test values('test')"))
    print(doSQL("select * from test", ["-table"]))
    print(doSQL("drop table test"))

    database = Database()
    database.addUser("test", "test")
    print(database.verifyUser("test", "test"))
    print(database.verifyUser("test", "test1"))