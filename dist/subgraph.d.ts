import { EnyoSubgraph } from '@enyo-web3/core';
import type { ProvidersWithEthers } from '@enyo-web3/ethers';
export interface ENSSubgraphOptions {
    customENSRegistryAddress?: string;
    network?: string;
}
export declare class ENSSubgraph extends EnyoSubgraph<ProvidersWithEthers> {
    ensRegistryAddress: string;
    network: string;
    constructor(options?: ENSSubgraphOptions);
    schema(providers: ProvidersWithEthers): import("graphql").GraphQLSchema;
    typeDefs(): import("@apollo/client").DocumentNode;
}
