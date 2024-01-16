import http.server as http
import json

import db

class RequestHandler(http.BaseHTTPRequestHandler):
    def __init__(self, request, client_address, server) -> None:
        super().__init__(request, client_address, server)

    def common(self):
        self.headers.add_header("Access-Control-Allow-Origin", "*")
        self.endpoint = self.path
        self.data = json.loads(self.rfile.read(int(self.headers.get('content-length'))).decode()) if self.rfile.readable() and not self.headers.get('content-length') == None else ""

    def do_GET(self):
        self.common()
        match self.endpoint:
            case "/guestbook/api/all":
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(db.getIds()).encode())
            case "/guestbook/api/get":
                id = self.data["id"]
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(db.get(id)).encode())
            case _:
                self.send_response(403)
                self.end_headers()

    def do_POST(self):
        self.common()
        match self.endpoint:
            case "/guestbook/api/add":
                username = self.data["username"]
                message = self.data["message"]
                self.send_response(200)
                self.end_headers()
                db.add(username, message)

    def do_PUT(self):
        self.common()
        match self.endpoint:
            case "/guestbook/api/like":
                id = self.data["id"]
                self.send_response(200)
                self.end_headers()
                db.like(id)

    def do_DELETE(self):
        self.common()
        match self.endpoint:
            case "/guestbook/api/delete":
                id = self.data["id"]
                self.send_response(200)
                self.end_headers()
                db.delete(id)

try:
    server = http.HTTPServer(("localhost", 64232), RequestHandler)
    server.serve_forever()
except KeyboardInterrupt:
    pass
print()