import s from './sites-list.module.scss'
import { useEffect } from 'react';
import { siteStore, SiteType } from 'store/site-store';


export const SitesList = () => {
  function renderSite(site: SiteType) {
    const dateAndTime = new Date(site.timestamp).toLocaleString();
    return (
      <div className={s.item}>
        <div className={s.title}>{site.url}</div>
        <div className={s.date}>{dateAndTime}</div>
      </div>
    )
  }

  return (
    <div className={s.list}>
      {
        siteStore.sites.map((site: SiteType) => renderSite(site))
      }
   </div>
  )
}
