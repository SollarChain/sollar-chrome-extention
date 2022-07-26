import s from './input-control.module.scss'

export let phrase:Array<any> = [];

export const InputControl = () => {
    
    
  return (
    <form action='submit' className={s.container}>
        <div className={s.row}>
            <input className={s.input} onChange={(e) => {phrase[0] = e.target.value}} placeholder='1' type="text" />
            <input className={s.input} onChange={(e) => {phrase[1] = e.target.value}} placeholder='2' type="text" />
            <input className={s.input} onChange={(e) => {phrase[2] = e.target.value}} placeholder='3' type="text" />
        </div>
        <div className={s.row}>
            <input className={s.input} onChange={(e) => {phrase[3] = e.target.value}} placeholder='4' type="text" />
            <input className={s.input} onChange={(e) => {phrase[4] = e.target.value}} placeholder='5' type="text" />
            <input className={s.input} onChange={(e) => {phrase[5] = e.target.value}} placeholder='6' type="text" />
        </div>
        <div className={s.row}>
            <input className={s.input} onChange={(e) => {phrase[6] = e.target.value}} placeholder='7' type="text" />
            <input className={s.input} onChange={(e) => {phrase[7] = e.target.value}} placeholder='8' type="text" />
            <input className={s.input} onChange={(e) => {phrase[8] = e.target.value}} placeholder='9' type="text" />
        </div>
        <div className={s.row}>
            <input className={s.input} onChange={(e) => {phrase[9] = e.target.value}} placeholder='10' type="text" />
            <input className={s.input} onChange={(e) => {phrase[10] = e.target.value}} placeholder='11' type="text" />
            <input className={s.input} onChange={(e) => {phrase[11] = e.target.value}} placeholder='12' type="text" />
        </div>
    </form>
  )
}
