import { createContext, useState } from "react";
export const blocksContext = createContext();

export default function Blockscontext({children}) {
const [blocks,setBlocks] = useState()
  return (
    <blocksContext.Provider value={{a:9}}>
    <div>
      {children}
    </div>
    </blocksContext.Provider>
  )
}
