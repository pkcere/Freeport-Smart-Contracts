const Davinci = artifacts.require("Davinci");
const log = console.log;

module.exports = async function (done) {

    let accounts = await web3.eth.getAccounts();

    let devAccounts = [
        "0x6d2b28389d3153689c57909829dFCf6241d36388", // Evgeny
        "0x1Bf6FCa28253A1257e4B5B3440F7fbE0c59D1546", // Sergey
        "0x51c5590504251A5993Ba6A46246f87Fa0eaE5897", // Aurel
    ];

    let D = await Davinci.deployed();
    log("Contract", D.address, "from account", accounts[0]);

    for (let devAccount of devAccounts) {
        await D.safeTransferFrom(accounts[0], devAccount, 0, 1e5 * 1e10, "0x");
        log("Sent 100k of currency to", devAccount);
    }

    done();
};