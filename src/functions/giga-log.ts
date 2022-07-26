import { toJS } from 'mobx'

export const gigaLog = (data: any) => console.log(toJS(data))
