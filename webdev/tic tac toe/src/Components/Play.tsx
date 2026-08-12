import * as React from 'react'

export const Play = () => {

const [tic, setTic] = React.useState<boolean>(false)
  return (
    <div> 
        <h1>Tic tac too</h1>
    <button>X</button>
    <button>X</button>
    <button>X</button>

      <div> 
    <button>X</button>
    <button>X</button>
    <button>X</button>
    </div>

      <div> 
    <button>X</button>
    <button>X</button>
    <button>X</button>
    </div>
    </div>
  
  )
}
