import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ethers } from "ethers";
import IPFS from "ipfs";

import logo from "./ethereumLogo.png";
import { addresses, abis } from "@project/contracts";

import "./App.css";
const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

let node;

const defaultProvider = new ethers.providers.Web3Provider(window.ethereum);
const ipfsContract = new ethers.Contract(
  addresses.ipfs,
  abis.ipfs,
  defaultProvider
);
const storageContract = new ethers.Contract(
  addresses.storage,
  abis.storage,
  defaultProvider
);


async function initIpfs() {
  node = await IPFS.create();
  const version = await node.version();
  console.log("IPFS Node Version:", version.version);
}

async function readCurrentUserFile() {
  const result = await ipfsContract.userFiles(
    defaultProvider.getSigner().getAddress()
    
  
  );
  console.log({ result });
 
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const account = accounts[0];//metamask current account

  
  return result;
}
async function getaccount(){
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  Object.values(accounts);
  const account =JSON.stringify(accounts[0]);
  console.log("FUNC");

  console.log({ account });

return account
}

function App() {
  const [ipfsHash, setIpfsHash] = useState("");
  useEffect(() => {
    initIpfs();
    window.ethereum.enable();
  }, []);

  useEffect(() => {
    async function readFile() {
      const file = await readCurrentUserFile();

      if (file !== ZERO_ADDRESS) setIpfsHash(file);
    }
    readFile();
  }, []);




  const [accountHash, setAccountHash] = useState("");
  useEffect(() => {
    window.ethereum.enable();
  }, []);

  useEffect(() => {
    async function readFile() {
      const file1 = await getaccount();

      if (file1 !== ZERO_ADDRESS) setAccountHash(file1);
    }
    readFile();
  }, []);




  async function setFile(hash) {
    const ipfsWithSigner = ipfsContract.connect(defaultProvider.getSigner());
    const tx = await ipfsWithSigner.setFile(hash);
    console.log({ tx });

    setIpfsHash(hash);
    
    ipfsWithSigner.store(hash);

  
  }


  async function Buyer() {

    
    const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
  
    await storageWithSigner.buyerUpload(ipfsHash);
  
  }


  async function Seller() {

    
    const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
    
    await storageWithSigner.sellerUpload(ipfsHash);

  
  }
  async function Set() {

    
    const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
    await storageWithSigner.SetEndTime(itemInput);

  
  }
  async function Extend() {

    
    const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
    
    await storageWithSigner.ExtendTime(itemInput1);

  
  }
  
  console.log(ipfsHash);
  

  const uploadFile = useCallback(async (file) => {
    const files = [
      {
        path: file.name + file.path,
        content: file,
      },
    ];

    for await (const result of node.add(files)) {
      await setFile(result.cid.string);
    }
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      uploadFile(acceptedFiles[0]);
    },
    [uploadFile]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    onDrop,
  });

  const [itemInput, setItemInput] = useState("");
  console.log(itemInput);
  const [itemInput1, setItemInput1] = useState("");
  console.log(itemInput1);




  return (
    <div className="App">
      <header className="App-header">
        <div {...getRootProps()} style={{ cursor: "pointer" }}>
          <img src={logo} className="App-logo" alt="react-logo" />
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>
              Drag 'n' drop some files here to upload to IPFS (or click the
              logo)
            </p>
          )}
        </div>
        
        <div>
          {ipfsHash !== "" ? (   
            <p>IPFS Hash: <mark className="mark-red">"{ipfsHash}"</mark></p>
            ) : (
              ""
            )}
        
        </div>  
        <div>User Hash:<mark className="mark-yellow">{accountHash}</mark></div>
   
        <div>
          {ipfsHash !== "" ? (
            

            <a
            
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              See current user file 
            </a>
          ) : (
            "No user file set yet"
          )}

        </div>
        <div>Buyer Can Set and Extend Time</div>
      
        <div>
          Set End Time:

         
          <input type="text" placeholder="Enter an item" value={itemInput} onChange={e => setItemInput(e.target.value)}
        
          />
          <button onClick={Set}>Buyer Set</button>
         </div>
         <div>
          Extend Time:
          <input type="text" placeholder="Enter an item" value={itemInput1} onChange={e => setItemInput1(e.target.value)}
         
          />
          <button onClick={Extend}>Buyer Extend</button>
         </div>
         <div>Buyer Clicks to Upload to Smart Contract:   <button onClick={Buyer}>Buyer Upload</button></div>
         <div>Seller Clicks to Upload to Smart Contract:   <button onClick={Seller}>Seller Upload</button></div>
         <script></script>
      </header>

    </div>
  );
  
}

export default App;


