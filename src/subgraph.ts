import { gql } from '@apollo/client';
import { EnyoSubgraph } from '@enyo-web3/core';
import type { ProvidersWithEthers, Network } from '@enyo-web3/ethers';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ethers } from 'ethers';

const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';

export interface ENSSubgraphOptions {
  customENSRegistryAddress?: string;
  network?: string;
}

export class ENSSubgraph extends EnyoSubgraph<ProvidersWithEthers> {
  ensRegistryAddress: string;
  network: string;

  constructor(options?: ENSSubgraphOptions) {
    super();

    this.ensRegistryAddress = options?.customENSRegistryAddress || ENS_REGISTRY_ADDRESS;
    this.network = options?.network || 'mainnet';
  }

  schema(providers: ProvidersWithEthers) {
    const ethersProvider = providers.ethers;
    const ensRegistryAddress = this.ensRegistryAddress;
    const network = this.network;

    return makeExecutableSchema({
      typeDefs: this.typeDefs(),
      resolvers: {
        Query: {
          async ensName(_, args: { name: string }) {
            const encodedName = ethers.utils.namehash(args.name);

            const result = await ethersProvider.multicall(
              network,
              [
                'function recordExists(bytes32) view returns (bool)',
                'function resolver(bytes32) view returns (address)',
                'function owner(bytes32 node) public virtual override view returns (address)',
              ],
              [
                { target: ensRegistryAddress, functionName: 'recordExists', functionArguments: [encodedName] },
                { target: ensRegistryAddress, functionName: 'owner', functionArguments: [encodedName] },
                { target: ensRegistryAddress, functionName: 'resolver', functionArguments: [encodedName] },
              ]
            );

            // recordExists result
            if (!result[0][0]) {
              return null;
            }

            const provider = ethersProvider.getProvider(network as Network);

            const resolver = new ethers.Contract(
              result[2][0],
              ['function text(bytes32, string) view returns (string)'],
              provider
            );

            // todo(carlos): evaluate the avatar URI into a fetchable URL
            const avatar = await resolver.text('avatar');

            return {
              id: encodedName,
              labelName: args.name,
              owner: result[1][0],
              avatar,
            };
          },
        },
      },
    });
  }

  typeDefs() {
    return gql`
      type Query {
        ensName(name: String!): ENSName
      }

      type ENSName {
        id: ID!
        labelName: String!
        owner: String!
        avatar: String
      }
    `;
  }
}
