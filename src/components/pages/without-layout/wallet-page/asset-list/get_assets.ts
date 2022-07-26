import { api } from "../../../../../api/axios-instanse";

export function getAssets(address:any, contractAddress:any) {
  return api.get(`contracts/ecma/getAssetInfo/${address}/${contractAddress}`);
}