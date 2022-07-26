import s from './tabs.module.scss'
import { AnimateSharedLayout, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { SetState } from '../../../types/utils/set-state'
import { useHistory } from 'react-router-dom'

type ITab = {
  text: string
  element: JSX.Element
}

type TabProps = {
  tab: ITab
  selectedTab: ITab
  setSelectedTab: SetState<ITab>
  isSmallTabs: boolean
}


const Tab = ({ tab, selectedTab, setSelectedTab, isSmallTabs }: TabProps) => {
  const isActive = tab.text === selectedTab.text

  return (
    <div
      onClick={() => setSelectedTab(tab)}
      className={`${s.tab} ${isActive && s.active} ${isSmallTabs && s.smallTab}`}
    >
      {tab.text}
      {
        isActive && <motion.div
          layoutId={'selected-tab-underline'}
          className={s.selectedTabUnderline}
          initial={true}
        />
      }
    </div>
  )
}


type Props = {
  tabs: ITab[]
  isSmallTabs?: boolean
  className?: string
  isHomePage?: boolean
}

export const Tabs = ({ tabs, isSmallTabs, className, isHomePage }: Props) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const history = useHistory();
  
  useEffect(() => {
    const search = new URLSearchParams(history.location.search);
    const presetFromSearch = search.get('selectedTab');
    if (presetFromSearch) {
      const tab = tabs.find(tab => tab.text === presetFromSearch)
      if (tab) {
        setSelectedTab(tab)
      }
    }
  }, [])

  return (
    <AnimateSharedLayout>
      <div className={`${s.tabs} ${className} ${isHomePage && s.isHomePage}`}>
        {tabs.map(tab =>
          <Tab
            key={tab.text}
            tab={tab}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
            isSmallTabs={!!isSmallTabs}
          />)}
      </div>
      {selectedTab.element}
    </AnimateSharedLayout>
  )
}
