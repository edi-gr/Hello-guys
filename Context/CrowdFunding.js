import React, { useState, useEffect } from "react";
import Wenb3Modal from "web3modal";
import { ethers } from "ethers";

import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
import { prototype } from "postcss/lib/previous-map";

const fetchContract = (signerOrProvider) => {
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";

  const [currentAccount, setCurrentAccount] = useState("");

  const createCamapaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider = providers.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime() //deadline,
      );

      await transaction.wait();

      console.log("contract call success", transaction);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    const currentUser = accounts[0];

    const filterCampaigns = allCampaigns.filter(
      (campaign) =>
        campaign.owner === "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );

    const userData = filteredCamapigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pid: i,
    }));
    return userData;
  };
  const donate = async (pId, amount) => {
    const web3Modal = new Wenb3Modal();
    const connection = await web3Modal.connect();
    const provider= new ethers.provider.Web3Provider(connection);
    const signer= provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData= await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    location.reload();
    return campaignData;
  }
  const getDonations = async(pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const donations= await contract.getDonators(pId);
    const numberofDonations = donations[0].length;
    
    const parsedDonations = [];

    for (let i = 0; i< numberofDonations; i++) {
      parsedDonations.push({
        donator:donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonations;
    
  }
  //---CHECK IF WALLET IS CONNECTED

  const checkIfWalletConnected = async () => {
    try {
      if(!window.ethereum)
        returnsetOpenError(true), setError("Install Metamask");

        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length){
          setCurrentAccount(accounts[0]);
        } else {
          console.log("No Account Found");
        }
      } catch(error){
        console.log("Something wrong while connecting to wallet");
      }
    };

    useEffect(() => {
      checkIfWalletConnected();
    }, []);

    //---CONNECT WALLET FUNCTION

    const connectWallet = async () => {
      try{
        if(!window.ethereum) return console.log("Insall Metamask");

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        } catch (error) {
          console.log("Error while connecting to wallet");
        }
    };
    return (
      <CrowdFFundingContext.Provider
       value={{
        titleData,
        currentAccount,
        createCampaigns,
        getUser
       }}
    )
  }
  

