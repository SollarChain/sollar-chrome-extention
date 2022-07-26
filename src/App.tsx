import { observer } from 'mobx-react-lite'
import { Redirect, Switch } from 'react-router-dom'
import { walletStore } from 'store/wallet-store'
import { useAppRoutes } from './app-routes'


export const App = observer(() => {
  const routes = useAppRoutes(walletStore.isLogin)

  return (
    <div className="app">
      <Switch>
        {routes}
      </Switch>
      <Redirect from="*" to="/" />
    </div>
  )
})
