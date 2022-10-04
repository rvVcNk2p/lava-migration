import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

const main = async (): Promise<any> => {
  const LavaDistribution: ContractFactory = await ethers.getContractFactory(
    "LavaDistribution"
  );
  const lavaDistribution: Contract = await LavaDistribution.deploy(
    "Lava Distribution"
  );

  await lavaDistribution.deployed();
  console.log(`Deployed to: ${lavaDistribution.address}`);
  console.log(`Contract name: ${await lavaDistribution.getContractName()}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
