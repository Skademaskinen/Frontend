
import sys
import os
# fix include paths
sys.path.append(f'{os.path.dirname(__file__)}/..')

from http.server import BaseHTTPRequestHandler, HTTPServer
from json import loads, dumps

from lib.db import Database
from lib.status import systemctl, update, lsblk, errors

addr = (
    sys.argv[sys.argv.index("--hostname")+1] if "--hostname" in sys.argv else sys.argv[sys.argv.index("-H")+1] if "-H" in sys.argv else "",
    int(sys.argv[sys.argv.index("--port")+1] if "--port" in sys.argv else sys.argv[sys.argv.index("-p")+1] if "-p" in sys.argv else "8080")
)

database = Database()

class RequestHandler(BaseHTTPRequestHandler):
    
    def end_headers(self):
        if "--debug" in sys.argv:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "*")
            self.send_header("Access-Control-Allow-Methods", "*")
        super().end_headers()

    def do_POST(self):
        global database
        size = int(self.headers.get('content-length', 0))
        data = loads(self.rfile.read(size).decode())
        match self.path:
            case "/admin/auth":
                password = data["password"]
                username = data["username"]
                print(f'Username: {username}')
                if database.verifyUser(username, password):
                    self.send_response(200)
                    self.end_headers()
                    token = database.getToken(username)
                    self.wfile.write(token.encode())
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Error! wrong credentials")
        
            case "/admin/register":
                password = data["password"]
                username = data["username"]
                if database.addUser(username, password):
                    self.send_response(200)
                    self.end_headers()
                    token = database.getToken(username)
                    self.wfile.write(token.encode())
                else:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(b"Error! user already exists")
            case "/admin/guestbook":
                message = data["message"]
                name = data["name"]
                time = data["time"]
                if all([time > (epoch + 6e10) for epoch in database.getTimestamps(name)]):
                    database.appendGuestbook(name, time, message)
                    self.send_response(200)
                    self.end_headers()
                else:
                    self.send_response(400)
                    self.end_headers()
            case "/admin/visit":
                token = data["token"]
                time = data["time"]
                today, yesterday, total = database.registerVisit(token, time)
                self.send_response(200)
                self.end_headers()
                self.wfile.write(dumps({
                    "today":today,
                    "yesterday":yesterday,
                    "total":total
                }).encode())
            case "/admin/verify":
                token = data["token"]
                if database.verifyToken(token):
                    self.send_response(200)
                else:
                    self.send_response(400)
                self.end_headers()
            case "/admin/authorize":
                token = data["token"]
                username = data["username"]
                if database.verifyToken(token):
                    database.authorize(username)
                    self.send_response(200)
                else:
                    self.send_response(400)
                self.end_headers()
            case "/admin/deauthorize":
                token = data["token"]
                username = data["username"]
                if database.verifyToken(token):
                    database.deauthorize(username)
                    self.send_response(200)
                else:
                    self.send_response(400)
                self.end_headers()
                




    def do_GET(self):
        args = None
        if "?" in self.path:
            path = self.path.split("?")[0]
            args = {kv.split("=")[0]:kv.split("=")[1] for kv in self.path.split("?")[1].split("&")}
        else:
            path = self.path
        match path:
            case "/admin/guestbook":
                if args is not None:
                    id = args["id"]
                    name, time, message = database.getGuestbookData(id)
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps({
                        "id":id,
                        "name":name,
                        "time":time,
                        "message":message
                    }).encode())
                else:
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps(database.getGuestbookIds()).encode())
            case "/admin/session":
                token = database.getVisitorToken()
                self.send_response(200)
                self.end_headers()
                self.wfile.write(token.encode())
            case "/admin/status":
                if args is not None:
                    token = args["token"]
                    if not database.verifyToken(token):
                        self.send_response(403)
                        self.end_headers()
                        return
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps({
                        "systemctl":systemctl(),
                        "update":update("nixos-update"),
                        "lsblk":lsblk(),
                        "errors":errors()
                    }).encode())
            case "/admin/users":
                if args is not None:
                    token = args["token"]
                    if not database.verifyToken(token):
                        self.send_response(403)
                        self.end_headers()
                        return
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps(database.getUsers()).encode())

    def do_DELETE(self):
        size = int(self.headers.get('content-length', 0))
        data = loads(self.rfile.read(size).decode())
        match self.path:
            case "/admin/delete":
                token = data["token"]
                username = data["username"]
                if not database.verifyToken(token):
                    self.send_response(403)
                    self.end_headers()
                database.deleteUser(username)
                self.send_response(200)
                self.end_headers()


    def do_OPTIONS(self):
        #self.send_header("Access-Control-Allow-Origin", "*")
        self.send_response(200)
        self.end_headers()



if __name__ == "__main__":
    print(f"Starting server with addr: {addr}")
    http = HTTPServer(addr, RequestHandler)
    try:
        http.serve_forever()
    except KeyboardInterrupt:
        print()
    print("exiting...")