import sys
import os
# fix include paths
sys.path.append(f'{os.path.dirname(__file__)}/..')

from http.server import BaseHTTPRequestHandler, HTTPServer
from json import loads

from lib.db import Database

addr = (
    sys.argv[sys.argv.index("--hostname")+1] if "--hostname" in sys.argv else sys.argv[sys.argv.index("-H")+1] if "-H" in sys.argv else "",
    int(sys.argv[sys.argv.index("--port")+1] if "--port" in sys.argv else sys.argv[sys.argv.index("-p")+1] if "-p" in sys.argv else "8080")
)

database = Database()

class RequestHandler(BaseHTTPRequestHandler):
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
                    self.send_response(403)
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
                    self.send_response(403)
                    self.end_headers()
                    self.wfile.write(b"Error! user already exists")

    def do_OPTIONS(self):
        self.send_header("Access-Control-Allow-Origin", "*")
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