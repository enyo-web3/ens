import { useQuery, gql } from '@apollo/client';

const QUERY = gql`
  query GetENSName($name: String!) {
    ensName(name: $name) {
      id
      labelName
      owner
      avatar
    }
  }
`;

export interface ENSName {
  id: string;
  labelName: string;
  owner: string;
  avatar: string | null;
}

export interface UseENSNameResult {
  ensName: ENSName | null;
  loading: boolean;
}

export function useENSName(name: string): UseENSNameResult {
  const { data, loading } = useQuery(QUERY, { variables: { name } });

  return {
    ensName: data?.ensName || null,
    loading,
  };
}
