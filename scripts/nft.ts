import { Contract } from "ethers";
import { ethers } from "hardhat";
import { abi } from "../artifacts/contracts/LavaNft.sol/LavaNft.json";

const nftAddress: string = "0xe304EDd5C4e590e2b8ce08b9625597FF38192D71";

const main = async (): Promise<any> => {
  const contract: Contract = new Contract(nftAddress, abi, ethers.provider);
  const tokenID: number = 395;
  const tokenURI = await contract.tokenURI(tokenID);
  console.log("=== TokenURI: ", tokenURI);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
