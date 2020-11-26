This project was bootstrapped with [Create Eth App](https://github.com/paulrberg/create-eth-app).

## IPFS Example App
## Deploy this contract and copy its address to packages>contracts>src>addresses.js

pragma solidity ^0.6.11;

contract IpfsStorage {
    mapping (address => string) public userFiles;

    function setFile(string memory file) external {
        userFiles[msg.sender] = file;
    }
}

```bash

brew install yarn

cd my-eth-app
  
cd packages

cd react-app/
 
yarn install
  
env | grep HOST

unset HOST

yarn start
 ```