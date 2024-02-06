import sys
import os
# fix include paths
sys.path.append(f'{os.path.dirname(__file__)}/..')

from http.server import BaseHTTPRequestHandler, HTTPServer
from json import loads, dumps
from subprocess import check_output
from requests import Session
import nmap
import threading

from lib.db import Database
from lib.status import systemctl, update, lsblk, errors

addr = (
    sys.argv[sys.argv.index("--hostname")+1] if "--hostname" in sys.argv else sys.argv[sys.argv.index("-H")+1] if "-H" in sys.argv else "",
    int(sys.argv[sys.argv.index("--port")+1] if "--port" in sys.argv else sys.argv[sys.argv.index("-p")+1] if "-p" in sys.argv else "8081")
)

if "--debug" in sys.argv:
    interface = "lo"
    with open(".debugdata.json", "r") as file:
        SERVER_ADDR = loads(file.read())["backend"]
else:
    interface = "end0"
    SERVER_ADDR = "https://skademaskinen.win:11034"


print(f"Server addr: {SERVER_ADDR}")

database = Database()

def verifyToken(token:str) -> bool:
    code = check_output([
        "curl",
        "-X", "POST",
        "-d", dumps({
            "token":token
        }),
        SERVER_ADDR+"/admin/verify",
        "--interface", interface,
        "-w", "%{http_code}"
    ]).decode().strip()
    return code == "200"
        
def scan():
    nm = nmap.PortScanner()
    ip = sys.argv[sys.argv.index("--inet")+1] if "--inet" in sys.argv else "10.225.171.0/24"
    nm.scan(ip)
    for host in nm.all_hosts():
        if "mac" in nm[host]["addresses"]:
            mac = nm[host]["addresses"]["mac"]
            alias = nm[host]["addresses"]["ipv4"]
            database.addDevice(mac, alias)
    print("finished scan")



class RequestHandler(BaseHTTPRequestHandler):

    def end_headers(self) -> None:
        if "--debug" in sys.argv:
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Headers", "*")
        else:
            self.send_header("Access-Control-Allow-Origin", "about.skademaskinen.win")
            self.send_header("Access-Control-Allow-Headers", "about.skademaskinen.win")
        super().end_headers()

    def do_POST(self):
        global database
        size = int(self.headers.get('content-length', 0))
        data = loads(self.rfile.read(size).decode())
        match self.path:
            case "/scan":
                token = data["token"]
                if not verifyToken(token):
                    self.send_response(403)
                    self.end_headers()
                    return
                threading.Thread(target=scan).start()
                self.send_response(200)
                self.end_headers()
            case "/boot":
                token = data["token"]
                mac = data["mac"]
                deviceData = database.getDeviceById(mac)
                subnet = sys.argv[sys.argv.index("--inet")+1] if "--inet" in sys.argv else "10.225.171.0/24"
                broadcast = ".".join(subnet.split(".")[:3]) + ".255"
                os.system(f"wol {deviceData['mac']} --ipaddr={broadcast}")
                self.send_response(200)
                self.end_headers()



    def do_GET(self):
        args = None
        if "?" in self.path:
            path = self.path.split("?")[0]
            args = {kv.split("=")[0]:kv.split("=")[1] for kv in self.path.split("?")[1].split("&")}
        else:
            path = self.path
        print(path)
        print(args)
        match path:
            case "/status":
                if args is not None:
                    token = args["token"]
                    if not verifyToken(token):
                        self.send_response(403)
                        self.end_headers()
                        return
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps({
                        "systemctl":systemctl(),
                        "update":update("System-Update"),
                        "lsblk":lsblk(),
                        "errors":errors()
                    }).encode())
            case "/devices":
                if args is not None:
                    token = args["token"]
                    if not verifyToken(token):
                        self.send_response(403)
                        self.end_headers()
                        return
                    self.send_response(200)
                    self.end_headers()
                    self.wfile.write(dumps(database.getDevices()
                    ).encode())
        

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    print(f"Starting server with addr: {addr}")
    try:
        http = HTTPServer(addr, RequestHandler)
        http.serve_forever()
    except KeyboardInterrupt as e:
        print("\nExiting...")