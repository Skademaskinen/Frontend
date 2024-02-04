from subprocess import check_output
import os

LSBLK_PATH = os.getenv("LSBLK_PATH") if not os.getenv("LSBLK_PATH") == None else "lsblk"

def systemctl(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output(["systemctl", "status"]).decode()
            
def update(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output(["journalctl", "-u", "nixos-update.service", "-n", "20"]).decode()

def lsblk(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output([LSBLK_PATH, "-o", "name,mountpoint,fstype,fsuse%"]).decode()

def errors(id:str) -> str:
    match id.lower():
        case "skademaskinen":
            return check_output("journalctl -n 1000 | grep error", shell=True).decode()


if __name__ == "__main__":
    systemctl("skademaskinen")
    update("skademaskinen")
    lsblk("skademaskinen")
    errors("skademaskinen")