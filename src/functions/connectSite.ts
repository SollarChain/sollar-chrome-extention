import { SiteStatus, siteStore } from "store/site-store";
import { api } from "../api/axios-instanse-backend";
import { passwordInputStore } from "../store/password-input-store";
import { walletStore } from "../store/wallet-store";
import { sign } from "./sign";

function connect(url:any, publicKey:any) {
	return new Promise(resolve => {
		fetch(url, {
			method: 'post',
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({wallet: publicKey, master_wallet: walletStore.pairKey.publicKey}),
		})
		.then(res => {
			resolve(res.json());
		})
	});
}



export const connectSite = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const bg: any = chrome.extension.getBackgroundPage()

    const url: string = tabs[0].url!
    const currentId: any = tabs[0].id
    const { origin } = new URL(url)

    const publicKey = walletStore.pairKey.publicKey
    const encryptedPrivate: any = localStorage.getItem("encryptedPrivate")

    const decryptedPrivate = walletStore.decryptData(encryptedPrivate, passwordInputStore.password)

    const dataForTokenMethod = JSON.stringify({ wallet: publicKey, master_wallet: publicKey })
    const resultTokenMethod = await api.post(bg?.frontendMethods?.[currentId]?.tokenMethod, dataForTokenMethod)


    const token = resultTokenMethod.data.token
    const signed = sign(token, decryptedPrivate)

    const dataForTokenSignMethod = JSON.stringify({ sign: signed, wallet: publicKey, master_wallet: publicKey })
    const resultTokenSignMethod = await api.post(bg?.frontendMethods?.[currentId]?.tokenSigndMethod, dataForTokenSignMethod)


    if (resultTokenSignMethod.data.is_verify) {
      const siteContract = await api.get(bg?.frontendMethods?.[currentId]?.siteContractMethod)
      const contractAddress = siteContract.data.contract_address
      const signAuth = sign(publicKey, decryptedPrivate)
      if (!siteStore.sites.find((item) => item.status == SiteStatus.connected && item.url == origin)) {
        walletStore.authToSite(contractAddress, signAuth)
      }
      siteStore.connectToSite(origin)

      chrome.runtime.sendMessage({ data: { authSuccess: true, ...resultTokenSignMethod.data } })
    } else {
      chrome.runtime.sendMessage({ data: { authSuccess: false } })
    }
  })
}
