## SSH Key
For using HTTPS in your server on localhost, you need to generate a certificate and a key.
To do so, do the following:

**Windows:**

1. Download and install:
Win32 OpenSSL v1.1.1 Light 
(https://slproweb.com/download/Win64OpenSSL_Light-1_1_1d.exe)
2. Type in some BASH (e.g. GIT-BASH):
```
openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost"
```
**Mac:**

1. Type in terminal
```
openssl req -x509 -out localhost.crt -keyout localhost.key -newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost"
```