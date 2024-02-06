from sys import argv
import os
from subprocess import check_output, CalledProcessError
import bcrypt
from json import loads
from secrets import token_urlsafe
import datetime

db = argv[argv.index("--db")+1] if "--db" in argv else "/tmp/skademaskinen.db3"
with open(argv[argv.index("--keyfile")+1] if "--keyfile" in argv else argv[argv.index("-kf")+1] if "-kf" in argv else "/tmp/skademaskinen-keyfile", "r") as file:
    MASTERKEY = file.read()

sqlite3 = os.getenv("SQLITE3_PATH") if not os.getenv("SQLITE3_PATH") == None else "sqlite3"

def doSQL(sql:str, args=[]) -> str:
    try:
        return check_output([
        sqlite3,
        db,
        sql
    ] + args).decode()
    except CalledProcessError as e:
        print(e.stdout)
        print(e.stderr)
    

def isToday(now:int, before:int) -> bool:
    datetimeNow = datetime.datetime.fromtimestamp(now)
    datetimeBefore = datetime.datetime.fromtimestamp(before)
    yeardiff = datetimeNow.year - datetimeBefore.year
    monthdiff = datetimeNow.month - datetimeBefore.month
    daydiff = datetimeNow.day - datetimeBefore.day
    return yeardiff == 0 and monthdiff == 0 and daydiff == 0


def isYesterday(now:int, before:int) -> bool:
    datetimeNow = datetime.datetime.fromtimestamp(now)
    datetimeBefore = datetime.datetime.fromtimestamp(before)
    yeardiff = datetimeNow.year - datetimeBefore.year
    monthdiff = datetimeNow.month - datetimeBefore.month
    daydiff = datetimeNow.day - datetimeBefore.day
    return yeardiff == 0 and daydiff == 1



class Database:
    def __init__(self) -> None:
        doSQL("create table if not exists users (username varchar primary key, password varbinary not null, salt varbinary not null, authorized boolean not null)")
        doSQL("create table if not exists tokencache (token varchar primary key, username varchar, foreign key(username) references users (username))")
        doSQL("create table if not exists guestbook (id integer primary key, name varchar not null, time integer not null, message varchar not null)")
        doSQL("create table if not exists visits (token varchar primary key, timestamp integer not null)")
        doSQL("create table if not exists devices (mac varchar primary key, alias varchar, flags varchar)")

    def addUser(self, username:str, password:str) -> bool:
        salt = bcrypt.gensalt()
        hash = bcrypt.hashpw(password.encode() + salt + MASTERKEY.encode(), salt)
        if not doSQL(f"select * from users where username = '{username}'") == "":
            return False
        doSQL(f"insert into users values('{username}', '{hash.decode()}', '{salt.decode()}', False)")
        return True
    
    def deleteUser(self, username:str):
        doSQL(f"delete from users where username = '{username}'")

    def verifyUser(self, username:str, password:str) -> bool:
        if doSQL(f"select * from users where username = '{username}'") == "":
            self.addUser(username, password)
            return False
        if doSQL(f"select authorized from users where username = '{username}'").strip() == "0":
            return False
        data:dict[str, str] = loads(doSQL(f"select * from users where username = '{username}'", ["-json"]))[0]
        hash = bcrypt.hashpw(password.encode() + data["salt"].encode() + MASTERKEY.encode(), data["salt"].encode())
        return hash == data["password"].encode()
    
    def getUsers(self) -> list[dict[str, str | bool]]:
        data = doSQL("select username,authorized from users", ["-json"])
        if not data == "":
            return loads(data)
        else:
            return []
    
    def authorize(self, username:str):
        doSQL(f"update users set authorized = true where username = '{username}'")

    def deauthorize(self, username:str):
        doSQL(f"update users set authorized = false where username = '{username}'")
    
    def getToken(self, username:str) -> str:
        if doSQL(f"select * from tokencache where username = '{username}'") == "":
            token = token_urlsafe(32)
            doSQL(f"insert into tokencache values ('{token}', '{username}')")
            return token
        else:
            return loads(doSQL(f"select token from tokencache where username = '{username}'", ["-json"]))[0]["token"]
    
    def verifyToken(self, token:str) -> bool:
        data = doSQL(f"select username from tokencache where token = '{token}'", ["-json"])
        if data == "":
            return False
        else:
            username = loads(data)[0]["username"]
            print(doSQL(f"select authorized from users where username = '{username}'"))
            return doSQL(f"select authorized from users where username = '{username}'").strip() == "1"

        
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
    
    def getVisitorToken(self) -> str:
        return token_urlsafe(32)
    
    def registerVisit(self, token, timestamp) -> (int, int, int):
        if doSQL(f"select * from visits where token = '{token}'") == "":
            doSQL(f"insert into visits values('{token}', {timestamp})")
        # get number of visits today
        data = doSQL(f"select timestamp from visits", ["-json"])
        if not data == "":
            json = loads(data)
        else:
            json = []
        today = len([row["timestamp"] for row in json if isToday(timestamp, row["timestamp"])])
        # get number of visits yesterday
        yesterday = len([row["timestamp"] for row in json if isYesterday(timestamp, row["timestamp"])])
        # get total vists
        total = len(json)
        return today, yesterday, total
    
    def addDevice(self, mac:str, alias=""):
        if not alias == "":
            doSQL(f"insert or replace into devices values ('{mac}', '{alias}')")
            print(f"added device: {mac} - {alias}")
        else:
            doSQL(f"insert or replace into devices (mac) values ('{mac}')")
            print(f"added device: {mac}")

    def getDevices(self) -> list[dict[str, str]]:
        data = doSQL("select * from devices", ["-json"])
        if not data == "":
            json = loads(data)
        else:
            json = []
        return json
    
    def getDeviceById(self, mac:int) -> dict[str, str]:
        data = doSQL(f"select * from devices where mac = '{mac}'", ["-json"])
        if not data == "":
            return loads(data)[0]
        else:
            return None
        
    def setDeviceAlias(self, mac:str, alias:str):
        doSQL(f"update devices set alias = '{alias}' where mac = '{mac}'")

    def setDeviceFlags(self, mac:str, flags:str):
        doSQL(f"update devices set flags = '{flags}' where mac = '{mac}'")
        




if __name__ == "__main__":
    print(doSQL("create table if not exists test (test varchar)"))
    print(doSQL("insert into test values('test')"))
    print(doSQL("select * from test", ["-table"]))
    print(doSQL("drop table test"))

    database = Database()
    database.addUser("test", "test")
    print(database.verifyUser("test", "test"))
    print(database.verifyUser("test", "test1"))