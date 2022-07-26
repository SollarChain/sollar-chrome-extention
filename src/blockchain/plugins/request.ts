import { MASTER_CONTRACT_ADDRESS } from "../../store/candy.store"

const API_PATH = process.env.REACT_APP_BLOCKCHAIN_URL;
const headers = {
  'content-type': 'application/json'
}

type Args = {
  data?: any
  contractAddress?: string | number
  method?: 'get' | 'post' | 'put' | 'delete'
}

export const request = <T>(path: string, {
  data,
  method = 'get',
  contractAddress = MASTER_CONTRACT_ADDRESS
}: Args): Promise<T> => {
  return new Promise(async resolve => {
    let url = `${API_PATH}${path}`

    if (url.endsWith('/')) {
      url += contractAddress
    } else {
      url += `/${contractAddress}`
    }


    fetch(url, {
      method,
      headers,
      body: data && JSON.stringify(data)
    })
      .then(res => {
        resolve(res.json())
      })
  })
}
