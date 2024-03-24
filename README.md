# alesafe

Alesafe is a CLI password manager tool for setting up and retrieving your passwords.

The general gist of it is that the application creates a file in your home directory:

```sh
~/.alesafe/.alexp.json
```

This JSON file contains the following format:

```json
"aleSafeSecurity": {
    "masterPasswordHash": "your hashed master password, remember this one",
    "salt": "some salt",
    "iterationCount": 1000
},
"credentials": [
  {
    "website1": "name of website1",
    "username1": "your username to website1",
    "password": "your password (encrypted) to website1",
  }
]
```

Using different Alesafe commands you can add, retrieve and list your credentials. It requires a master password to access, but given a valid master password users will be able to read their saved credentials.

Have a look at the [example file](https://github.com/Keffin/alesafe/blob/main/alexp-example.json)
