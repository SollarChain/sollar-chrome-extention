import { makeAutoObservable } from 'mobx'

export enum SiteStatus {
    connect = 'Connect',
    connected = 'Connected',
    disabled = 'Not connected'
}

export type SiteType = {
    url: string;
    status: SiteStatus;
    timestamp: number;
}

class SiteStore {
    currentUrl: string = '';
    sites: SiteType[] = localStorage.getItem('connectedSites') ? JSON.parse(localStorage.getItem('connectedSites')!): [];

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });

        chrome.tabs?.query({active: true, currentWindow: true}, (tabs: any) => {
            const url = new URL(tabs[0].url!);
            const origin = url.origin;
            this.currentUrl = origin;
        });
    }

    currentSite() {
        return this.sites.find(_ => _.url === this.currentUrl);
    }

    addSite(siteUrl: string, status: SiteStatus) {
        const timestamp = new Date().getTime();
        if (!this.sites.find(_ => _.url === siteUrl)) {
            this.sites.push({
                url: siteUrl, status, timestamp
            });

            localStorage.setItem('connectedSites', JSON.stringify(this.sites));
        }
        return this.sites;
    }

    connectToSite(siteUrl: string) {
        return this.addSite(siteUrl, SiteStatus.connected);
    }
}

export const siteStore = new SiteStore();