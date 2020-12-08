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
var storageContract;
console.log( addresses.ipfs);

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

   function SetContract() {
    storageContract = new ethers.Contract(itemInput2, abis.storage, defaultProvider);
    console.log(itemInput2);
    console.log(abis.storage);
    console.log(storageContract);

      
    try {
      if(itemInput2== "") throw "Empty! Enter Smart Contract Hash.";
      if(isNaN(itemInput2)) throw "Not a number! Enter Smart Contract Hash.";
      
    }
    catch(err) {
      console.log(err);
      document.getElementById("text-box").innerHTML = err
    }
     
    return storageContract;
  
  }


  async function Buyer() {

  
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.buyerUpload(ipfsHash,itemInput);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }


  async function Seller() {


    
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.sellerUpload(ipfsHash);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }

  async function Extend() {



    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.ExtendTime(itemInput1);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }


  async function status() {

    var status_array=["ON", "BUYER_UPLOADED", "SELLER_UPLOADED", "DOC_OK", "DOC_DEFECT", "DOC_REJECTED"];


    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());

      var statust = await storageWithSigner.getStatus();

      document.getElementById("text-box1").innerHTML = status_array[statust]
      return 
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }
    
    
  
  }


  async function time() {

    var time_array=["ON_TIME", "OUT_OF_TIME"];


    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());

      var timet = await storageWithSigner.getTimeStatus();

      document.getElementById("text-box2").innerHTML = time_array[timet]
      return 
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }
    
    
  
  }
  

  async function getContractFile() {

    
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());

      var contractfile = await storageWithSigner.See_Doc_Hash(itemInput3);
      document.getElementById("myAnchor").innerHTML ="See Contract File";
      document.getElementById("myAnchor").href = `https://ipfs.io/ipfs/${contractfile}`;
      document.getElementById("myAnchor").target = "_blank";
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").innerHTML = err.message
    }

       
  
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
  const [itemInput2, setItemInput2] = useState("");
  console.log(itemInput2);
  const [itemInput3, setItemInput3] = useState("");
  console.log(itemInput3);


  return (
    <div className="App">
      <header className="App-header">
      <div id="text-box"></div>
      <div>
          Smart Contract: <input type="text" placeholder="Contract Hash" value={itemInput2} onChange={e => setItemInput2(e.target.value)}/>
        <button onClick={SetContract}>Set</button>
      </div>
      <div> <button onClick={status}>See Current Status</button> <button onClick={time}>See Current Time</button> </div>
      
      <div id="text-box1"></div>
      
      <div id="text-box2"></div>

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
            <p>Current IPFS Hash: <mark className="mark-red">"{ipfsHash}"</mark></p>
            ) : (
              ""
            )}
        
        </div>  
        <div>Current User Hash:<mark className="mark-yellow">{accountHash}</mark></div>
   
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
        <div>
         Buyer Sets Time and Uploads to The Smart Contract: <input type="text" placeholder="Enter Time" value={itemInput} onChange={e => setItemInput(e.target.value)}/>
         <button onClick={Buyer}>Buyer Upload</button>
        </div>
        <div></div>
      

        <div>
        Buyer Extends Time:
        <input type="text" placeholder="Enter Time" value={itemInput1} onChange={e => setItemInput1(e.target.value)}
       
        />
        <button onClick={Extend}>Buyer Extend</button>
       </div>
         <div>Seller Uploads to The Smart Contract: <button onClick={Seller}>Seller Upload</button>
         </div>
         <div>
          Smart Contract Files: <input type="text" placeholder="Enter Hash" value={itemInput3} onChange={e => setItemInput3(e.target.value)}/>
        <button onClick={getContractFile}>See Contract Files</button>
         </div>
         <a id="myAnchor" href=""></a>


      </header>

    </div>
  );
          
  
}

export default App;


