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
export declare function useENSName(name: string): UseENSNameResult;
