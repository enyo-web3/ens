"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENSSubgraph = void 0;
const client_1 = require("@apollo/client");
const core_1 = require("@enyo-web3/core");
const schema_1 = require("@graphql-tools/schema");
const ethers_1 = require("ethers");
const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e';
class ENSSubgraph extends core_1.EnyoSubgraph {
    constructor(options) {
        super();
        this.ensRegistryAddress = (options === null || options === void 0 ? void 0 : options.customENSRegistryAddress) || ENS_REGISTRY_ADDRESS;
        this.network = (options === null || options === void 0 ? void 0 : options.network) || 'mainnet';
    }
    schema(providers) {
        const ethersProvider = providers.ethers;
        const ensRegistryAddress = this.ensRegistryAddress;
        const network = this.network;
        return (0, schema_1.makeExecutableSchema)({
            typeDefs: this.typeDefs(),
            resolvers: {
                Query: {
                    ensName(_, args) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const encodedName = ethers_1.ethers.utils.namehash(args.name);
                            const result = yield ethersProvider.multicall(network, [
                                'function recordExists(bytes32) view returns (bool)',
                                'function resolver(bytes32) view returns (address)',
                                'function owner(bytes32 node) public virtual override view returns (address)',
                            ], [
                                { target: ensRegistryAddress, functionName: 'recordExists', functionArguments: [encodedName] },
                                { target: ensRegistryAddress, functionName: 'owner', functionArguments: [encodedName] },
                                { target: ensRegistryAddress, functionName: 'resolver', functionArguments: [encodedName] },
                            ]);
                            // recordExists result
                            if (!result[0][0]) {
                                return null;
                            }
                            const provider = ethersProvider.getProvider(network);
                            const resolver = new ethers_1.ethers.Contract(result[2][0], ['function text(bytes32, string) view returns (string)'], provider);
                            // todo(carlos): evaluate the avatar URI into a fetchable URL
                            const avatar = yield resolver.text('avatar');
                            return {
                                id: encodedName,
                                labelName: args.name,
                                owner: result[1][0],
                                avatar,
                            };
                        });
                    },
                },
            },
        });
    }
    typeDefs() {
        return (0, client_1.gql) `
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
exports.ENSSubgraph = ENSSubgraph;
//# sourceMappingURL=subgraph.js.map