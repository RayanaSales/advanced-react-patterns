// State Reducer
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import {Switch} from '../switch'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionType = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionType.toggle: {
      return {on: !state.on}
    }
    case actionType.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

/**
 * we are changing the reducer. If the user passes, we usem theirs, if not, we use ours.
 */
function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: actionType.toggle})
  const reset = () => dispatch({type: actionType.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

// export {useToggle, toggleReducer, actionTypes}
// import {useToggle, toggleReducer, actionTypes} from './use-toggle'
/**
 * we export and import, so we can simplified this file, and use the stuff into the App Component.
 */

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  function toggleStateReducer(state, action) {
    // the click is being hndled by their own state reducer, and the reset by the default toggleReducer.
    if (action.type === actionType.toggle && clickedTooMuch) {
      return {on: state.on}
    }
    return toggleReducer(state, action)
  }

  // this is the user, you can pass this or not - comment the line 82. Will work exactly the same.
  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleStateReducer,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          disabled: clickedTooMuch,
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
