import Web3 from 'web3';
import ENS from 'ethereum-ens';
import namehash from 'eth-ens-namehash';
import DFaucet from './DFaucet';

import PublicResolverContract from '../contracts/PublicResolver.json'

let httpTimeout = 2000;

// var registryAddresses = {
//   // Mainnet
//   "1": "0x314159265dd8dbb310642f98f50c066173c1259b",
//   // Ropsten
//   "3": "0x112234455c3a32fd11230c42e7bccd4a84e02010",
//   // Rinkeby
//   "4": "0xe7410170f87102DF0055eB195163A03B7F2Bff4A",
// };

let chainID = 3;

let registryAddress = process.env.REACT_APP_ENS_ADDRESS;


class DEns {

  constructor(provider, options = {}){
    this.web3 = new Web3(new Web3.providers.HttpProvider(provider, httpTimeout));
    this.ens = new ENS(this.web3, registryAddress);

    let ensRegistryInterface = [{"constant": true,"inputs": [{"name": "node","type": "bytes32"}],"name": "resolver","outputs": [{"name": "","type": "address"}],"type": "function"},{"constant": true,"inputs": [{"name": "node","type": "bytes32"}],"name": "owner","outputs": [{"name": "","type": "address"}],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "resolver","type": "address"}],"name": "setResolver","outputs": [],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "label","type": "bytes32"},{"name": "owner","type": "address"}],"name": "setSubnodeOwner","outputs": [],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "owner","type": "address"}],"name": "setOwner","outputs": [],"type": "function"}],resolverInterface: [{"constant": true,"inputs": [{"name": "node","type": "bytes32"}],"name": "addr","outputs": [{"name": "","type": "address"}],"type": "function"},{"constant": true,"inputs": [{"name": "node","type": "bytes32"}],"name": "content","outputs": [{"name": "","type": "bytes32"}],"type": "function"},{"constant": true,"inputs": [{"name": "node","type": "bytes32"}],"name": "name","outputs": [{"name": "","type": "string"}],"type": "function"},{"constant": true,"inputs": [{"name": "node","type": "bytes32"},{"name": "kind","type": "bytes32"}],"name": "has","outputs": [{"name": "","type": "bool"}],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "addr","type": "address"}],"name": "setAddr","outputs": [],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "hash","type": "bytes32"}],"name": "setContent","outputs": [],"type": "function"},{"constant": false,"inputs": [{"name": "node","type": "bytes32"},{"name": "name","type": "string"}],"name": "setName","outputs": [],"type": "function"},{"constant": true,"inputs": [{"name": "node","type": "bytes32"},{"name": "contentType","type": "uint256"}],"name": "ABI","outputs": [{"name": "","type": "uint256"},{"name": "","type": "bytes"}],"payable": false,"type": "function"}];
    this.ensRegistryContract = new this.web3.eth.Contract(ensRegistryInterface);
    this.ensRegistryContract.options.address = registryAddress;

    this.gasPrice = this.web3.utils.toWei('1500', 'gwei');

    if(options.fifsRegistrarContractAddress === undefined) throw new Error('fifsRegistrarContractAddress must be provided');

    let fifsRegistrarContractAbi = [{"constant":false,"inputs":[{"name":"subnode","type":"bytes32"},{"name":"owner","type":"address"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"ensAddr","type":"address"},{"name":"node","type":"bytes32"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
    this.fifsRegistrarContract = new this.web3.eth.Contract(fifsRegistrarContractAbi, options.fifsRegistrarContractAddress);

    if(options.resolverContractAddress === undefined) throw new Error('resolverContractAddress must be provided');

    var resolverContractAbi = PublicResolverContract.abi
    this.resolverContractAddress = options.resolverContractAddress
    this.resolverContract = new this.web3.eth.Contract(PublicResolverContract.abi, options.resolverContractAddress);

    // window.ensRegistryContract = this.ensRegistryContract;
    // window.registrarContract = this.registrarContract;
    // window.fifsRegistrarContract =  this.fifsRegistrarContract;
    // window.resolverContract = this.resolverContract;
    // window.namehash = namehash;
    // window.web3 = this.web3;
    // window.ens = this.ens;

    this.registerSubdomainToAddressState = 0;

  }

  watchTx(hash){
    return new Promise((resolve, reject) => {
      var interval = setInterval(()=>{
        console.log('checking... ' + hash)
        try {
          let response = this.web3.eth.getTransactionReceipt(hash);
          if(response !== null){
            clearInterval(interval);
            if(response.status === '0x0'){
              console.log(response)
              throw new Error('transaction ' + response.transactionHash + ' failed!');
            }
            resolve(response);
          }
        }catch(error) {
          reject(error);
        }
      },2000);
    });
  }

  ensureHasBalance(address){
    let intervalTime = 2000;
    let tries = 200;

    return new Promise((resolve, reject) => {
      let i = 0;
      let interval = setInterval(()=>{
        i++;
        this.web3.eth.getBalance(address).then((balance)=>{
          console.log(i+ "/ checking: "+address+" balance: "+balance);
          if(i > tries){
            clearInterval(interval);            
            reject(false);
            return;
          }
          if(parseInt(balance) > 0){
            clearInterval(interval);
            resolve(true);
          }
        });
      }, intervalTime);
    });
  }

  registerSubdomainToAddress(subdomain, address, wallet, feedbackMessageCallback = false){
    if(feedbackMessageCallback) feedbackMessageCallback('verifying subdomain, waiting for node...');    
    this.registerSubdomainToAddressState = 0;

    return this.getSubdomainAvailiability(subdomain).then((availability)=>{
      if(availability){
        feedbackMessageCallback('gifting you eth to cover your gas costs! <3 ');
        DFaucet.gimmie(address).then((hash)=>{
          console.log('gimmie complete tx: '+hash);
        }).catch((error)=>{
          console.log('gimmie errored: '+error);
        });

        return this.ensureHasBalance(address).then((balance)=>{
          feedbackMessageCallback('gifted you x eth to cover your gas costs, registering subdomain...');
          return this.registerSubdomain(subdomain, wallet).then((tx)=>{
            this.registerSubdomainToAddressState = 1;
            if(feedbackMessageCallback) feedbackMessageCallback('setting resolver...');
            return this.setResolver(subdomain, wallet).then((tx2)=>{  // must be contract owner :-/
              this.registerSubdomainToAddressState = 2; 
              if(feedbackMessageCallback) feedbackMessageCallback('registering to your address, waiting for tx...');                 
              console.log(tx2);
              return this.setAddr(subdomain, address, wallet).then((tx3)=>{ // May only be called by the owner of that node in the ENS registry.
                this.registerSubdomainToAddressState = 3;                      
                if(feedbackMessageCallback) feedbackMessageCallback('registering your public key, waiting for tx...');                             
                console.log(tx3);
                return this.setPubKey(subdomain, wallet).then((tx4)=>{ // May only be called by the owner of that node in the ENS registry.
                  this.registerSubdomainToAddressState = 4;
                  console.log(tx4.transactionHash);
                  return tx4.transactionHash;
                  // return this.setSubnodeOwner(subdomain, address).then((tx5)=>{
                  //   this.registerSubdomainToAddressState = 5;
                  //   console.log(tx5);
                  //   console.timeEnd('registered');
                  // });
                });
              });
            });
          })
        });
      }else{
        return false;
      }
    });

  }  

  getSubdomainAvailiability(subdomain){
    return this.ens.owner(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME).then((response)=>{
      return response === "0x0000000000000000000000000000000000000000";
    })
  }

  registerSubdomain(subdomain, wallet){
    let dataTx = this.fifsRegistrarContract.methods.register(this.web3.utils.sha3(subdomain), wallet.wallet.getAddressString()).encodeABI();
    let privateKey = wallet.wallet.getPrivateKeyString();
    let tx = {
      from: wallet.wallet.getAddressString(),
      to: process.env.REACT_APP_FIFS_REGISTRAR_ADDRESS, //fifs registrar contract address
      data: dataTx,
      gas: 800000,
      // nonce: 11 //tbc......
    };
    
    return this.web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
      return this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .once('transactionHash', function(hash){ 
          return hash;
        });
    });
  }

  setResolver(subdomain, wallet){
    let node = namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME);
    let addr = this.resolverContractAddress;

    let dataTx = this.ensRegistryContract.methods.setResolver(node, addr).encodeABI();
    let privateKey = wallet.wallet.getPrivateKeyString();
    let tx = {
      from: wallet.wallet.getAddressString(),
      to: registryAddress, //fifs registrar contract address
      data: dataTx,
      gas: 510000,
      // nonce: 11 //tbc......
    };

    return this.web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
      return this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .once('transactionHash', function(hash){ 
          return hash;
        });
    });

  }

  setAddr(subdomain, address, wallet){
    let node = namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME);
    let addr = wallet.wallet.getAddressString();

    let dataTx = this.resolverContract.methods.setAddr(
      namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME), 
      address
    ).encodeABI();
    let privateKey = wallet.wallet.getPrivateKeyString();
    let tx = {
      from: wallet.wallet.getAddressString(),
      to: this.resolverContractAddress,
      data: dataTx,
      gas: 510000,
      // nonce: 11 //tbc......
    };

    return this.web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
      return this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .once('transactionHash', function(hash){ 
          return hash;
        });
    });

  }

  setPubKey(subdomain, wallet){
    let publicKey = wallet.wallet.getPublicKeyString();
    let publicKeyX = publicKey.substring(0,66);
    let publicKeyY = "0x"+publicKey.substring(66,130);

    let node = namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME);
    let addr = wallet.wallet.getAddressString();

    console.log(namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME), 
      publicKeyX,
      publicKeyY
    )

    let dataTx = this.resolverContract.methods.setPubkey(
      namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME), 
      publicKeyX,
      publicKeyY
    ).encodeABI();
    let privateKey = wallet.wallet.getPrivateKeyString();
    let tx = {
      from: wallet.wallet.getAddressString(),
      to: this.resolverContractAddress, //fifs registrar contract address
      data: dataTx,
      gas: 510000,
      // nonce: 11 //tbc......
    };

    return this.web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
      return this.web3.eth.sendSignedTransaction(signed.rawTransaction)
        .once('transactionHash', function(hash){ 
          return hash;
        });
    });

  } 

  getPubKey(subdomain){
    return  this.resolverContract.methods
      .pubkey(namehash.hash(subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME))
      .call()
      .then((keyCoords)=>{
          let keyStr = "04"+keyCoords[0].substring(2,66)+keyCoords[1].substring(2,66);
          if(keyStr !== "0400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"){
            return keyStr;
          }else{
            return false;
          }
          return;
      });
  }

  setSubnodeOwner(subdomain, address){
    return this.ens.setSubnodeOwner(
      subdomain + '.'+ process.env.REACT_APP_DOMAIN_NAME,
      address, 
      {
        from: this.web3.eth.accounts[0],
      }
    ).then((tx) => {
      console.log('setting subnode owner to ' + address + ', watching...');
      return this.watchTx(tx);
    });
  }

}

export default DEns;