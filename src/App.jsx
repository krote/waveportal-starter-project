import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

const getEthereumObject = () => window.ethereum;

const findMetaMaskAccount = async () => {
  try{
    const ethereum = getEthereumObject();

    /*
    * First make sure we have access to the Ethereum object.
    */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const contractAddress = "0x053389336e02bd70882Ce7e4D46C063de262710E";
  const contractABI = abi.abi;

  const wave = async() => {
    try{
      const { ethereum } = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        //
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining....", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mining....", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count....", count.toNumber());
        
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.error(error);
    }
  }

  const connectWallet = async () => {
    try{
      const ethereum = getEthereumObject();
      if(!ethereum){
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(()=>{
    findMetaMaskAccount().then((account)=>{
      if(account!=null){
        setCurrentAccount(account);
      }
    });
  },[]);
  return(
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          Hey there!
        </div>
        <div className="bio">
          I am krote
        </div>
        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {/*
          * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )
          
        }
      </div>
    </div>
  );
};

export default App;
