$(document).ready(function(){

var isConnected = false;
var abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "nows",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "then",
				"type": "uint256"
			}
		],
		"name": "Check",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "connectSelf_toVaults",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_poolAsset",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_assetAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_stakedAsset",
				"type": "string"
			}
		],
		"name": "createPool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_stakeAssetAmount",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_assetName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "depositAsset",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "joinPool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "payPoolCycle",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "servicePool",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_assetName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_receiver",
				"type": "address"
			}
		],
		"name": "withdrawAsset",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dashboard",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "assetName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "available",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "staked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "contributed",
						"type": "uint256"
					}
				],
				"internalType": "struct Utils.AccountSummary[]",
				"name": "sum",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getContractAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getList_ofPools",
		"outputs": [
			{
				"internalType": "contract PoolsList",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMap_ofVaults",
		"outputs": [
			{
				"internalType": "contract VaultMap",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_account",
				"type": "address"
			}
		],
		"name": "isAccountConnected",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewConcludedPools",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_cycleNo",
				"type": "uint256"
			}
		],
		"name": "viewCycle",
		"outputs": [
			{
				"internalType": "contract Cycle",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewPendingPools",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_poolId",
				"type": "uint256"
			}
		],
		"name": "viewPool",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "poolName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "poolAssetName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "poolAssetAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "stakeAssetName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "stakeAssetAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "maxNoOfMembers",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "currentCycleNo",
				"type": "uint8"
			},
			{
				"internalType": "uint8",
				"name": "currentNoOfMembers",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "poolStatus",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "viewRunningPools",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_account",
				"type": "address"
			}
		],
		"name": "viewRunningPools_withAccount",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
var contractAddress = "0xc603671474AbDE8D798C282f7389c9a5fBb66Bf9";
var contract;
var self;

// var imported = document.createElement('script');
// imported.src = 'https://cdn.jsdelivr.net/npm/web3@1.3.5/dist/web3.min.js';
// document.head.appendChild(imported);

// window.addEventListener('load', connectWeb3);

async function connectWeb3() {
    if(window.ethereum){
        console.log("Web3 dectected");
		window.web3 = new Web3(window.ethereum);
		window.ethereum.enable();
        isConnected = true;
        contract = await new window.web3.eth.Contract(abi, contractAddress);
        self = await web3.eth.getAccounts();
        self = self[0].toString();
        web3.eth.handleRevert = true;
        console.log(self);
	}
    else if(typeof web3 !== 'undefined') {
        console.log('Web3 Detected! ' + web3.currentProvider.constructor.name);
        window.web3 = new Web3(web3.currentProvider);
        isConnected = true;
        contract = new window.web3.eth.Contract(abi, contractAddress);
    }
    else {
        console.log('No Web3 Detected... using HTTP Provider')
        isConnected = false;
        //window.web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/<APIKEY>"));
        //
    }
}

function isConnected(){
    return isConnected;
}

async function getSelf(){
    addr = await web3.eth.getAccounts();
    return addr[0].toString();
}


async function dashboard(){
    getSelf().then(async function(addr){
        const x = await contract.methods.dashboard().call({from: addr});
        for(i=0; i<x.length; i++){
            $("#withdrawable"+x[i]['assetName']).html(x[i]['available'] + " " + x[i]['assetName']);
            $("#staked"+x[i]['assetName']).html(x[i]['staked'] + " " + x[i]['assetName']);
            $("#contributed"+x[i]['assetName']).html(x[i]['contributed'] + " " + x[i]['assetName']);
            $("#contributed"+x[i]['assetName']).html(x[i]['contributed'] + " " + x[i]['assetName']);
        }
        console.log(x);
    });
}

async function deposit(assetName, amount){
    getSelf().then(async function(addr){
        if(assetName.toUpperCase() == 'BNB'){
            status = await contract.methods.depositAsset(assetName, Web3.utils.toWei(amount,'ether')
                                                        ).send({from: addr, value: Web3.utils.toWei(amount,'ether')}
                                                        ).catch((err) => {
                                                            console.log(err)});
            
        }
        else{
            status = await contract.methods.depositAsset(assetName, Web3.utils.toWei(amount,'ether')).call({from: addr});
            console.log(status);
        }
    });
}

connectWeb3();
dashboard();

$("#connectAccount").on("click", async function(e){
    getSelf().then(async function(addr){
        pools = await contract.methods.connectSelf_toVaults().send({from: addr}
                                                    )/*.then(function(){

                                                    })*/;
    });
});

$("#withdrawForm").submit(async function(e){
    e.preventDefault();
    withdraw($(this));
});

$("#depositForm").submit(function(e){
    e.preventDefault();
    form = $(this);
    deposit(form[0].elements[0].value, form[0].elements[1].value);
});


$("#createPool").submit(async function(e){
    e.preventDefault();
    form = $(this);
    poolName = form[0].elements[0].value;
    asset = form[0].elements[1].value.toUpperCase();
    amount = form[0].elements[2].value;
    stakingAsset = form[0].elements[3].value.toUpperCase();
    getSelf().then(async function(addr){
        status = await contract.methods.createPool(poolName, asset, amount, stakingAsset
                                                    ).send({from: addr}
                                                    ).catch((err) => {console.log(err)});
        console.log(status);
    });
});


$("#loadRunningPools").on("click", async function(e){
    e.preventDefault();
    getSelf().then(async function(addr){
        pools = await contract.methods.viewRunningPools_withAccount(addr).call({from: addr}
                                                    )/*.then(function(){

                                                    })*/;
        console.log(pools);                                                    
        for(i=0; i<pools.length; i++){
			pool = await contract.methods.viewPool(pools[i]).call({from: addr}).then( function(pool){
				$("#runningPools").append(
					`<li class="list-group-item mb-2">
					<h6 class="font-weight-bold my-0">${pool.poolName}</h6>
					<div class="d-flex justify-content-between align-items-center">
						<div><small>Pool asset:</small> <code>${pool.poolAssetName}</code></div>
						<div><small>Asset amount:</small> <code>${pool.poolAssetAmount} ${pool.poolAssetName}</code></div>
						<div><small>Staking asset:</small> <code>${pool.stakeAssetName}</code></div>
						<div><small>Staking asset amount:</small> <code >${pool.stakeAssetAmount} ${pool.stakeAssetName}</code></div>
						<div><small>Member status:</small> <code>${pool.currentNoOfMembers}/${pool.maxNoOfMembers}</code></div>
						<a href="viewpool.html?id=${pool.id}" type="button" class="btn-warning btn-sm viewPool">View</a>
					</div>
					</li>`
				);
			});
        }
    });
});

$("#runningPools").on("click", ".viewPool", async function(e){
	console.log($(this).attr("poolid"));
	id = $(this).attr("poolid");
    getSelf().then(async function(addr){
        pools = await contract.methods.joinPool(id).send({from: addr}
                                                    )/*.then(function(){

                                                    })*/;
    });
});


$("#loadPendingPools").on("click", async function(e){
    e.preventDefault();
    getSelf().then(async function(addr){
        pools = await contract.methods.viewPendingPools().call({from: addr}
                                                    )/*.then(function(){

                                                    })*/;
        console.log(pools);                                                    
        for(i=0; i<pools.length; i++){
			pool = await contract.methods.viewPool(pools[i]).call({from: addr}).then( function(pool){
				$("#pendingPools").append(
					`<div class="col-4 col-lg-6 mb-3">
						<div class="card text-center bg-dark">
						<img src="../Includes/icons/shape.png" class="float-left mt-2" width="15" height="12">
						<div class="card-body p-0">
								<h5 class="card-title font-weight-bolder"><span>${pool.poolName}</span></h5>
								<p class="mb-1">Contributing<code> ${pool.poolAssetAmount} ${pool.poolAssetName}</code></p>
								<p>Staking<code > ${pool.stakeAssetAmount} ${pool.stakeAssetName}</code></p>
						</div>
						<div class="card-footer p-0 text-muted">
							<img src="../Includes/icons/person.svg" alt="user">${pool.currentNoOfMembers}/${pool.maxNoOfMembers}
							<button type="button" class="btn btn-main btn-sm joinPool my-2 ml-3" poolId="${pool.id}">Join</button>
						</div>
						</div>
					</div>`
				);
			});
        }
    });
});

$("#pendingPools").on("click", ".joinPool", async function(e){
	console.log($(this).attr("poolid"));
	id = $(this).attr("poolid");
    getSelf().then(async function(addr){
        pools = await contract.methods.joinPool(id).send({from: addr}
                                                    )/*.then(function(){

                                                    })*/;
    });
});


$("#viewPool").on("click", async function(e){
	e.preventDefault();
	id = $.urlParam('id');
    getSelf().then(async function(addr){
        pool = await contract.methods.viewPool(id).call({from: addr}).then( function(pool){
			$("#viewPool").append(
				`<div class="col-4 col-lg-6 mb-3">
					<div class="card text-center bg-dark">
					<img src="../Includes/icons/shape.png" class="float-left mt-2" width="15" height="12">
					<div class="card-body p-0">
							<h5 class="card-title font-weight-bolder"><span>${pool.poolName}</span></h5>
							<p class="mb-1">Contributing<code> ${pool.poolAssetAmount} ${pool.poolAssetName}</code></p>
							<p>Staking<code > ${pool.stakeAssetAmount} ${pool.stakeAssetName}</code></p>
					</div>
					<div class="card-footer p-0 text-muted">
						<img src="../Includes/icons/person.svg" alt="user">${pool.currentNoOfMembers}/${pool.maxNoOfMembers}
						<button type="button" class="btn btn-main btn-sm joinPool my-2 ml-3" poolId="${pool.id}">Join</button>
					</div>
					</div>
				</div>`
			);
		});
	});
});


$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}
// $("#pendingPools").on("click", ".joinPool", async function(e){
// 	console.log($(this).attr("poolid"));
// 	id = $(this).attr("poolid");
//     getSelf().then(async function(addr){
//         pools = await contract.methods.joinPool(id).send({from: addr}
//                                                     )/*.then(function(){

//                                                     })*/;
//     });
// });

});// jquery
