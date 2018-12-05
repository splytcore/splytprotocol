const AssetManager = artifacts.require("./AssetManager.sol")
const SplytManager = artifacts.require("./SplytManager.sol")
const ManagerTracker = artifacts.require("./ManagerTracker.sol")
const SatToken = artifacts.require("./SatToken.sol")
const Stake = artifacts.require("./Stake.sol")
const Asset = artifacts.require("./Asset.sol")

contract('StakeTest general test cases.', function(accounts) {

  const defaultBuyer = accounts[0]
  const defaultSeller = accounts[1]
  const defaultMarketPlace = accounts[2]
  const defaultAffiliate = accounts[3]

  let satTokenInstance;
  let assetManagerInstance;
  let splytManagerInstance;
  let assetInstance;
  let stakeInstance;

  //how much tokens each should have
  const defaultTokens = 205000000

  //default asset vars
  const id1Hex = web3.toHex("id1")
  const id2Hex = web3.toHex("id2")
  const title = web3.toHex("my title")
  const expirationSecs = (new Date()).getTime() / 1000
  const inventoryCount = 1
  const defaultCost = 10000000
  const term = 0
  const marketPlaceKickback = 5


  async function create_asset(_assetId = "0x31f2ae92057a7123ef0e490a", _term = 0, _seller = defaultSeller, _title = "MyTitle",
      _totalCost = defaultCost, _expirationDate = 10001556712588, _mpAddress = defaultMarketPlace, _mpAmount = 2, _inventoryCount = 1) {
    
    // let managerTrackerAddress = await splytManagerInstance.getManagerTrackerAddress();

    await assetManagerInstance.createAsset(_assetId, _term, _seller, _title, _totalCost, _expirationDate, _mpAddress, _mpAmount, _inventoryCount)
    assetAddress = await assetManagerInstance.getAddressById(_assetId)
    assetInstance = await Asset.at(assetAddress)

  }

  // This function gets ran before every test cases in this file.
  before('Default instances of contracts for each test', async function() {
    console.log('Deploy contracts')
    satTokenInstance = await SatToken.deployed()   
    assetManagerInstance = await AssetManager.deployed()
    splytManagerInstance = await SplytManager.deployed()
    managerTrackerInstance = await ManagerTracker.deployed()
    stakeInstance = await Stake.deployed()
    accounts.forEach(async function(acc) {
      await satTokenInstance.initUser(acc)
    })

  })

  it('should get manager tracker address successfully!', async function() {
    // await create_asset();
    let managerTrackerAddress = await splytManagerInstance.getManagerTrackerAddress()
    // console.log('manager tracker address: ' + managerTrackerAddress);
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    assert.notEqual(managerTrackerAddress, 0x0, "managerTracker has not been deployed!")
  })

  it('should create new asset manager contract successfully!', async function() {    
    let assetManagerAddress = assetManagerInstance.address
    assert.notEqual(assetManagerAddress, 0x0, "AssetManager has not been deployed!")
  })

  it('should display initial balance default seller!', async function() {
    let balance = await splytManagerInstance.getBalance(defaultSeller)
    // console.log('initial balance ' + balance)
    assert.equal(parseInt(balance), defaultTokens, "initial balance of default seller!")
  })

  it('should deploy new asset contract successfully!', async function() {
    await create_asset();
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    assert.notEqual(assetInstance.address, 0x0, "Asset contract has not been deployed!")
  })


  it('should subtract stake amount from balance!', async function() {
    
    let stake = await stakeInstance.calculateStakeTokens(defaultCost)
    console.log('stake: ' + stake)
    let balance = await splytManagerInstance.getBalance(defaultSeller)

    let expectedBalance = defaultTokens - parseInt(stake)

    console.log('expected balance after lising asset ' + expectedBalance)

    console.log('current balance after lising asset ' + balance)
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    assert.equal(expectedBalance, balance, "new balance of default seller after listing!")
  })


  it('should get stake amount from if cost is 1,000,000!', async function() {
    let stakeAmount = await assetInstance.initialStakeAmount()
    // console.log('stake amount: ' + stakeAmount);

    let stakeAmount2 = await stakeInstance.calculateStakeTokens(defaultCost);
    // console.log('stake amount(Stake Contract): ' + stakeAmount2);
    assert.equal(parseInt(stakeAmount), parseInt(stakeAmount2), "Expected stake amount does not match!")
  })

  it('should get stake amount if cost is 100,000!', async function() {
    let price = 100000

    await assetManagerInstance.createAsset(id1Hex, term, defaultSeller, title, price, expirationSecs, defaultMarketPlace, marketPlaceKickback, inventoryCount)
    
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    let address = await assetManagerInstance.getAddressById(id1Hex)
    // console.log("id1 address " + address)
    let stake1 = await Asset.at(address).initialStakeAmount()   
    let stake2 = await stakeInstance.calculateStakeTokens(price)
    
    // console.log('stake 1 ' + stake1)
    // console.log('stake 2 ' + stake2)
 
    assert.equal(parseInt(stake1), parseInt(stake2), "Stake amount is incorrect");
  })

  it('should get stake amount if cost is 200,000!', async function() {
    let price = 200000

    await assetManagerInstance.createAsset(id1Hex, term, defaultSeller, title, price, expirationSecs, defaultMarketPlace, marketPlaceKickback, inventoryCount)
    
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    let address = await assetManagerInstance.getAddressById(id1Hex)
    // console.log("id1 address " + address)
    let stake1 = await Asset.at(address).initialStakeAmount()   
    let stake2 = await stakeInstance.calculateStakeTokens(price)
    
    // console.log('stake 1 ' + stake1)
    // console.log('stake 2 ' + stake2)
 
    assert.equal(parseInt(stake1), parseInt(stake2), "Stake amount is incorrect");
  })

  it('should get stake amount if cost is 2,000,000!', async function() {
    let price = 2000000000

    await assetManagerInstance.createAsset(id1Hex, term, defaultSeller, title, price, expirationSecs, defaultMarketPlace, marketPlaceKickback, inventoryCount)
    
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    let address = await assetManagerInstance.getAddressById(id1Hex)
    // console.log("id1 address " + address)
    let stake1 = await Asset.at(address).initialStakeAmount()   
    let stake2 = await stakeInstance.calculateStakeTokens(price)
    
    // console.log('stake 1 ' + stake1)
    // console.log('stake 2 ' + stake2)
 
    assert.equal(parseInt(stake1), parseInt(stake2), "Stake amount is incorrect");
  })

  it('should get stake amount if cost is 20,000,000!', async function() {
    let price = 20000000000

    await assetManagerInstance.createAsset(id1Hex, term, defaultSeller, title, price, expirationSecs, defaultMarketPlace, marketPlaceKickback, inventoryCount)
    
    // assert.equal(orderId, , 'No money should be transfered to seller\'s wallet!');
    let address = await assetManagerInstance.getAddressById(id1Hex)
    // console.log("id1 address " + address)
    let stake1 = await Asset.at(address).initialStakeAmount()   
    let stake2 = await stakeInstance.calculateStakeTokens(price)
    
    // console.log('stake 1 ' + stake1)
    // console.log('stake 2 ' + stake2)
 
    assert.equal(parseInt(stake1), parseInt(stake2), "Stake amount is incorrect");
  })      
})