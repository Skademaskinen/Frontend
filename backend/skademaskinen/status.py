from subprocess import check_output

def systemctl(id:str) -> str:
    match id:
        case "skademaskinen":
            return check_output(["systemctl", "status"]).decode()
            
def update(id:str) -> str:
    match id:
        case "skademaskinen":
            return check_output(["journalctl", "-u", "nixos-update.service", "-n", "20"]).decode()

def lsblk(id:str) -> str:
    match id:
        case "skademaskinen":
            return check_output(["lsblk", "-o", "name,mountpoint,fstype,fsuse%"]).decode()

def errors(id:str) -> str:
    match id:
        case "skademaskinen":
            return check_output("journalctl -n 1000 | grep error", shell=True).decode()


if __name__ == "__main__":
    systemctl("skademaskinen")
    update("skademaskinen")
    lsblk("skademaskinen")
    errors("skademaskinen")