import sys
import os
# fix include paths
sys.path.append(f'{os.path.dirname(__file__)}/..')

from http.server import BaseHTTPRequestHandler, HTTPServer
from json import loads, dumps
import html

from lib.tables.Users import Users
from lib.tables.Guestbook import Guestbook
from lib.tables.Tokens import Tokens
from lib.tables.Visits import Visits
from lib.tables.Threads import Threads
from lib.tables.Posts import Posts
from lib.Database import Database
from lib.status import systemctl, update, lsblk, errors
from lib.Utils import getArg, printHelp

addr = (
    getArg(["--hostname", "-H"], "", str),
    getArg(["--port", "-p"], 8080, int)
)
db = getArg(["--database", "-db"], "/tmp/skademaskinen.db3", str)
debug = getArg(["--debug", "-d"], False, bool)

database = Database(db, [Users, Tokens, Visits, Guestbook, Threads, Posts])
users:Users = database.tables()[Users.__name__]
tokens:Tokens = database.tables()[Tokens.__name__]
visits:Visits = database.tables()[Visits.__name__]
guestbook:Guestbook = database.tables()[Guestbook.__name__]
threads:Threads = database.tables()[Threads.__name__]
posts:Posts = database.tables()[Posts.__name__]

class RequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        if debug:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Access-Control-Allow-Methods", "*")
        else:
            self.send_header("Access-Control-Allow-Origin", "https://about.skademaskinen.win")
            self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def parseData(self):
        size = int(self.headers.get("Content-Length", 0))
        match self.command:
            case "POST":
                self.data = loads(self.rfile.read(size).decode()) if size else {}
                self.cmd = self.path[7:]
            case "DELETE":
                self.data = loads(self.rfile.read(size).decode()) if size else {}
                self.cmd = self.path[7:]
            case _:
                if "?" in self.path:
                    self.data = {kv.split("=")[0]:kv.split("=")[1] for kv in self.path.split("?")[1].split("&")}
                    self.cmd = self.path.split("?")[0][7:]
                else:
                    self.data = {}
                    self.cmd = self.path[7:]
        self.data = {key:html.escape(value) if type(value) is str and not key == "html" else value for key, value in self.data.items()}
        if debug:
            print(f"\033[38;2;100;100;100mData:    {self.data}\nCommand: {self.cmd}\nPath:    {self.path}\033[0m")


    def ok(self, data=""):
        self.send_response(200)
        self.end_headers()
        if data:
            self.wfile.write(data.encode())
        
    def deny(self, data=""):
        self.send_error(400)
        self.end_headers()
        if data:
            self.wfile.write(data.encode())

    def do_POST(self):
        self.parseData()
        match self.cmd:
            case "auth":
                if users.verify(self.data["username"], self.data["password"]):
                    self.ok(tokens.get(self.data["username"]))
                else:
                    self.deny("Access Denied")
                return
            case "register":
                users.add(self.data["username"], self.data["password"])
                return
            case "guestbook":
                if all([self.data["time"] > (epoch + 6e10) for epoch in guestbook.timestamps(self.data["name"])]):
                    guestbook.append(self.data["name"], self.data["time"], self.data["message"])
                    self.ok()
                else:
                    self.deny()
                return
            case "visit":
                today, yesterday, total = visits.get(self.data["time"])
                self.ok(dumps({
                    "today":today,
                    "yesterday":yesterday,
                    "total":total
                }))
                return
        if tokens.verify(self.data["token"]):
            match self.cmd:
                case "verify":
                    self.ok()
                case "authorize":
                    users.authorize(self.data["username"])
                    self.ok()
                case "deauthorize":
                    users.deauthorize(self.data["username"])
                    self.ok()
                case "post":
                    posts.new(self.data["html"])
                    self.ok()
                case "newthread":
                    threads.new(self.data["name"], self.data["description"])
                case "editthread":
                    if self.data["description"]:
                        threads.setDescription(self.data["description"])
                    if self.data["name"]:
                        threads.setName(self.data["name"])
                case "editpost":
                    if self.data["html"]:
                        posts.setContent(self.data["html"])
        else:
            self.deny()
    
    def do_GET(self):
        self.parseData()
        if debug: print(self.data)
        match self.cmd:
            case "guestbook":
                if self.data:
                    entry = guestbook.get(self.data["id"])
                    self.ok(dumps({
                        "id":self.data["id"],
                        "name":entry["name"],
                        "time":entry["time"],
                        "message":entry["message"]
                    }))
                else:
                    self.ok(dumps(guestbook.ids()))
                return
            case "session":
                token = visits.new()
                visits.register(token, self.data["time"])
                self.ok(token)
                return
            case "threads":
                self.ok(dumps(threads.ids()))
                return
            case "thread":
                self.ok(dumps(threads.get(self.data["id"])))
                return
            case "posts":
                self.ok(dumps(posts.ids(self.data["id"])))
                return
            case "post":
                self.ok(posts.get(self.data["id"]))
                return
        if tokens.verify(self.data["token"]):
            match self.cmd:
                case "status":
                    self.ok(dumps({
                        "systemctl":systemctl(),
                        "update":update("nixos-upgrade"),
                        "lsblk":lsblk(),
                        "errors":errors()
                    }))
                case "users":
                    self.ok(dumps(users.all()))
        else:
            self.deny()

    def do_DELETE(self):
        self.parseData()
        if tokens.verify(tokens.verify(self.data["token"])):
            match self.cmd:
                case "delete":
                    users.delete(self.data["username"])
                    self.ok()
                case "thread":
                    threads.delete(self.data["id"])
                case "post":
                    posts.delete(self.data["id"])
        else:
            self.deny()

    def do_OPTIONS(self):
        self.ok()

if __name__ == "__main__":
    if getArg(["--help", "-h", "-?"], False, bool):
        printHelp()
        exit(0)
    try:
        http = HTTPServer(addr, RequestHandler)
        http.serve_forever()
    except KeyboardInterrupt:
        print()