import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const main = async (): Promise<any> => {
  const LavaMigration: ContractFactory = await ethers.getContractFactory(
    "LavaMigration"
  );
  const lavaMigration: Contract = await LavaMigration.deploy("Lava Migration");

  await lavaMigration.deployed();
  console.log(`Contract name: ${await lavaMigration.getContractName()}`);
  console.log(`Deployed to: ${lavaMigration.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
