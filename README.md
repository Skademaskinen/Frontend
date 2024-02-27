# Skademaskinen | Frontend

<a href="https://about.skademaskinen.win">https://about.skademaskinen.win</a>

## Backend

### Database Structure
Presented data is from a test environment and does not reflect the deployed system

<hr>

#### Users

```
+----------+--------------------------------------------------------------+-------------------------------+------------+
| username |                           password                           |             salt              | authorized |
+----------+--------------------------------------------------------------+-------------------------------+------------+
| tester   | $2b$12$Ndglqzz8nlp0G2Myluy7YOVatgu49X2t4r6tJJ0yw527qr1QPDtNW | $2b$12$Ndglqzz8nlp0G2Myluy7YO | 1          |
| tester1  | $2b$12$sPKmJs8qwE.MCnAoCKtZMuMWVFsG45ZiQ.gqgcBQbl6cx4wfVMUia | $2b$12$sPKmJs8qwE.MCnAoCKtZMu | 0          |
+----------+--------------------------------------------------------------+-------------------------------+------------+
```

<hr>

#### Guestbook

```
+----+------+---------------+---------+
| id | name |     time      | message |
+----+------+---------------+---------+
| 1  | test | 1707259780031 | test    |
+----+------+---------------+---------+
```
<hr>

#### Tokencache

```
+---------------------------------------------+----------+
|                    token                    | username |
+---------------------------------------------+----------+
| ToLqkoKTpLAs8E_EzfmfEFSRq9EvG_Gbp4QJWaYjpdA | tester   |
+---------------------------------------------+----------+
```

<hr>

#### devices

```
+-------------------+-------+-------+
|        mac        | alias | flags |
+-------------------+-------+-------+
| E0:23:FF:23:FA:B0 |       |       |
| E8:48:B8:EA:4E:C0 |       | f     |
| CA:95:33:12:CE:91 |       |       |
| D8:3A:DD:E8:67:04 |       |       |
| A0:D0:5B:2E:C2:9E |       |       |
+-------------------+-------+-------+
```
