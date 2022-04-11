"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useENSName = void 0;
const client_1 = require("@apollo/client");
const QUERY = (0, client_1.gql) `
  query GetENSName($name: String!) {
    ensName(name: $name) {
      id
      labelName
      owner
      avatar
    }
  }
`;
function useENSName(name) {
    const { data, loading } = (0, client_1.useQuery)(QUERY, { variables: { name } });
    return {
        ensName: (data === null || data === void 0 ? void 0 : data.ensName) || null,
        loading,
    };
}
exports.useENSName = useENSName;
//# sourceMappingURL=useENSName.js.map