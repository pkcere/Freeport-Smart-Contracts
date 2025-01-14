const Freeport = artifacts.require("Freeport");
const TestERC20 = artifacts.require("TestERC20");
const FiatGateway = artifacts.require("FiatGateway");
const log = console.log;

module.exports = async function (done) {

    // A fixed account for tests.
    let serviceAccount = "0xc0DAe4aE8d21250a830B2A79314c9D43cAeab145";

    const CURRENCY = 0;
    let oneB = "1" + "000" + "000" + "000" + "000000"; // 1B with 6 decimals or 100K with 10 decimals;
    let twoB = "2" + "000" + "000" + "000" + "000000";

    let accounts = await web3.eth.getAccounts();
    let admin = accounts[0];
    let freeport = await Freeport.deployed();
    let erc20 = await TestERC20.deployed();
    let gateway = await FiatGateway.deployed();
    log("Operating on Freeport contract", freeport.address);
    log("Operating on TestERC20 contract", erc20.address);
    log("Operating on FiatGateway contract", gateway.address);
    log("From admin account", admin);

    const PAYMENT_SERVICE = await gateway.PAYMENT_SERVICE.call();

    log("Set an exchange rate of 0.1 token for $0.01");
    await gateway.setExchangeRate(0.1e10);

    log("Give the permission to execute payments to the service account", serviceAccount);
    await gateway.grantRole(PAYMENT_SERVICE, serviceAccount);

    log("Mint and deposit some ERC20 to the admin account.");
    await erc20.mint(admin, twoB);
    await erc20.approve(freeport.address, twoB);
    await freeport.deposit(twoB);

    let devAccounts = [
        gateway.address,
        serviceAccount
    ];

    for (let devAccount of devAccounts) {
        await freeport.safeTransferFrom(admin, devAccount, CURRENCY, oneB, "0x");
        log("Sent 1B of currency to", devAccount);
    }

    done();
};
