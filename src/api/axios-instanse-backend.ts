import axios from 'axios'

export const axiosApi: any = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})


class API {
  async request(url: string, method: string, data?: any) {
    const res = await axiosApi[method](url, data);
    return res;
  }

  async get(url: string) {
    return this.request(url, 'get');
  }

  async post(url: string, data: any) {
    return this.request(url, 'post', data);
  }
}

export const api = new API();
