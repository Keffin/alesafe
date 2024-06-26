# alesafe

Alesafe is a CLI password manager tool for setting up and retrieving your passwords. Basic functionality in place, but still a WIP, among todos are better argument flags and terminal UI.

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

### How to use

Install it

```sh
npm install alesafe
```

Setup your alesafe configuration

```sh
alesafe setup
```

For retrieving a specific password

```sh
alesafe get
```

For retrieving all passwords

```sh
alesafe list
```

For adding a new password

```
alesafe add
```
