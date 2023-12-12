// Prop Collections and Getters
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {Switch} from '../switch'

/**
 * this is basically a functions that I can call, passing any number of functions,
 * that will return a function that calls all of these functions
 */
function callAll(...fns) {
  return (...args) => {
    fns.forEach(fn => {
      fn && fn(...args)
    })
  }
}

function useToggle() {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  /** this is helping us to compose everything we need. 
   * Supose you have 2 handle clicks, which one should win? This function will solve it.
   * 
   * We can also compose together styles, classes, event handlers.
   */
  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  return {
    on,
    toggle,
    getTogglerProps,
  }
}

function App() {
  const {on, getTogglerProps} = useToggle()
  return (
    <div>
      <Switch {...getTogglerProps({on})} />
      <hr />
      <button
        {...getTogglerProps({
          'aria-label': 'custom-button',
          onClick: () => console.info('onButtonClick'),
        })}
      >
        {on ? 'on' : 'off'}
      </button>
    </div>
  )
}

export default App
