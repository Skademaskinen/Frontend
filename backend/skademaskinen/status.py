from subprocess import check_output
import os
import requests

LSBLK_PATH = os.getenv("LSBLK_PATH") if not os.getenv("LSBLK_PATH") == None else "lsblk"

HOME_CACHE = []

def clear_home_cache():
    global HOME_CACHE
    HOME_CACHE = {}

def doHome():
    global HOME_CACHE
    if HOME_CACHE == {}:
        HOME_CACHE = requests.get("https://skademaskinen.win:40455/status")

def systemctl(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output(["systemctl", "status"]).decode()
        case "home":
            doHome()
            return HOME_CACHE["systemctl"]
            
def update(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return f'{check_output(["journalctl", "-u", "nixos-upgrade.service", "-n", "20"]).decode()}\n{check_output(["journalctl", "-u", "nixos-upgrade.timer", "-n", "20"]).decode()}'
        case "home":
            doHome()
            return HOME_CACHE["update"]

def lsblk(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output([LSBLK_PATH, "-o", "name,mountpoint,fstype,fsuse%"]).decode()
        case "home":
            doHome()
            return HOME_CACHE["lsblk"]

def errors(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return "\n".join([line for line in check_output(["journalctl", "-n", "1000"]).decode() if "error" in line])
        case "home":
            doHome()
            return HOME_CACHE["errors"]


if __name__ == "__main__":
    print(systemctl("skademaskinen"))
    print(update("skademaskinen"))
    print(lsblk("skademaskinen"))
    print(errors("skademaskinen"))
    print(systemctl("home"))
    print(update("home"))
    print(lsblk("home"))
    print(errors("home"))