import React, { useCallback, useEffect, useState } from "react";

import { ethers } from "ethers";

import logo from "./ethereumLogo.png";
import { addresses, abis } from "@project/contracts";

import "./App.css";

const ZERO_ADDRESS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";


const defaultProvider = new ethers.providers.Web3Provider(window.ethereum);
var storageContract;

async function getaccount(){
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  Object.values(accounts);
  const account =JSON.stringify(accounts[0]);
  console.log("FUNC");

  console.log({ account });

return account
}


function App() {
  

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
      document.getElementById("text-box").className = "color-red";

      document.getElementById("text-box").innerHTML = err
    }
     
    return storageContract;
  
  }


  async function Buyer() {

  
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.buyerUpload(1,itemInput);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }
 


  async function voteright() {

  
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner. giveRightToVote(itemInput);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }

  async function removevoteright() {

  
    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner. removeRightToVote(itemInput1);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }

  async function endtime() {



    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.VotingEndTime(itemInput3);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }

  async function vote() {



    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());
      await storageWithSigner.vote(itemInput4);
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
  
  }
  

  async function status() {

    var status_array=["ON", "BUYER_UPLOADED", "SELLER_UPLOADED", "DOC_OK", "DOC_DEFECT", "DOC_REJECTED","MONEY_SENT"];
    var time_array=["ON_TIME", "OUT_OF_TIME"];


    try {
      const storageWithSigner = storageContract.connect(defaultProvider.getSigner());

      var balance = await storageWithSigner.check_Contract_Balance();

      var statust = await storageWithSigner.getStatus();

      var timet = await storageWithSigner.getTimeStatus();

      document.getElementById("text-box1").innerHTML = "Status: "+status_array[statust] +"  Time: "+ time_array[timet] +"  Balance: "+ balance
      return 
      
    }
    catch(err) {
      console.log(err.message);
      document.getElementById("text-box").className = "color-red";
      document.getElementById("text-box").innerHTML = err.message
    }
    
    
  
  }



  


  


  const [itemInput, setItemInput] = useState("");
  console.log(itemInput);
  const [itemInput1, setItemInput1] = useState("");
  console.log(itemInput1);
  const [itemInput2, setItemInput2] = useState("");
  console.log(itemInput2);
  const [itemInput3, setItemInput3] = useState("");
  console.log(itemInput3);
  const [itemInput4, setItemInput4] = useState("");
  console.log(itemInput4);
 
 
  


  return (
    <div className="App">
      <header className="App-header">
       <div id="text-box"></div>
       <body className="info">
       <div>
          Smart Contract: <input type="text" placeholder="Contract Hash" value={itemInput2} onChange={e => setItemInput2(e.target.value)}/>
        <button onClick={SetContract}>Set</button>
        </div>
      <div>Current User Hash: <mark className="mark-red">{accountHash}</mark></div>

      <div> <button onClick={status}>See Current Status</button> </div>
      
      <div id="text-box1"></div>
      </body>

        <body className="fintech">
        <div>
          Fintech Gives Right to Vote: <input type="text" placeholder="Hash" value={itemInput} onChange={e => setItemInput(e.target.value)}/>
        <button onClick={voteright}>Give</button>
        </div>
        <div>
          Fintech Removes Right to Vote: <input type="text" placeholder="Hash" value={itemInput1} onChange={e => setItemInput1(e.target.value)}/>
        <button onClick={removevoteright}>Remove</button>
        </div>
        <div>
        Fintechs Sets Time:
        <input type="text" placeholder="Enter Time" value={itemInput3} onChange={e => setItemInput3(e.target.value)}/>
        <button onClick={endtime}>Set</button>
        </div>
         </body>
         <body className="banks">
         <div>
        Banks Vote:
        <input type="text" placeholder="Proposal" value={itemInput4} onChange={e => setItemInput4(e.target.value)}/>
        <button onClick={vote}>Vote</button>
        </div>

         </body>



      </header>

    </div>
  );
 
  
}

export default App;


