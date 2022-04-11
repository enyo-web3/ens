import { useQuery, gql } from '@apollo/client';
const QUERY = gql `
  query GetENSName($name: String!) {
    ensName(name: $name) {
      id
      labelName
      owner
      avatar
    }
  }
`;
export function useENSName(name) {
    const { data, loading } = useQuery(QUERY, { variables: { name } });
    return {
        ensName: (data === null || data === void 0 ? void 0 : data.ensName) || null,
        loading,
    };
}
//# sourceMappingURL=useENSName.js.map