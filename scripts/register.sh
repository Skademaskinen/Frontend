echo -n 'Username: '
read username
echo

echo -n 'Password: '
read -s password
echo


curl -X 'POST' -d "{\"password\": \"$password\", \"username\":\"$username\"}" https://api.skademaskinen.win:11034/register