const hre = require("hardhat");

async function main() {
    // Define constructor arguments
    const zkvContract = "0x147AD899D1773f5De5e064C33088b58c7acb7acf";  // Replace with actual deployed address
    const vkey = "0xf5f5bde8bd9a0dabea99dd36f0dceac835c3f44f49a6fa739a7a90ab3cac6bb6";
    const vhash = "0x5f39e7751602fc8dbc1055078b61e2704565e3271312744119505ab26605a942";
    const tokenURI = "https://launchpad.collectify.app/main/metadata/B2VW359XP"; // Replace with actual metadata URI

    // Deploy the contract
    const ZkVerification = await hre.ethers.getContractFactory("ZkVerification");
    const deployedContract = await ZkVerification.deploy(zkvContract, vkey, vhash, tokenURI);

    await deployedContract.waitForDeployment();

    console.log(`✅ Contract deployed at: ${await deployedContract.getAddress()}`);
}

// Execute deployment
main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});
