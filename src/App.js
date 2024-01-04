
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton'
import './App.css';

export const ACTIONS = {   /*global variable containing a list of all calculator actions*/
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}


function reducer(state, { type, payload }) {
  /*reducer function, state has 3 parameters: currentOperand, previousOperand, operation
  manages the state, aka the calculator logic
  function reducer(state, action) action is seperated into { type, payload } -> types of actions, that deliver some payload (parameters) */
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      /* handling edgecases */
      /*leading zeroes*/
      if (payload.digit === '0' && state.currentOperand === '0') return state
      /*decimal points*/
      if (payload.digit == '.' && state.currentOperand == null){ 
        return {
        ...state,
        currentOperand: `${'0.'}`
        } 
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state
      /* overwriting after evaluation */
      /* from case ACTIONS.EVALUATE: in a real calculator, if you add a digit after evaluating, it will replace the currentOperand*/
      if (state.overwrite) {  /*overwrite boolean lets us know when currentOperand is result of ACTIONS.EVALUATE*/
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      return {
        ...state, /* The spread operator ... is used to include all the existing properties of the state while modifying the selected property. */
        currentOperand: `${state.currentOperand || ""}${payload.digit}`, /*here only current operand changes, according to the payload*/
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {  /*if no numbers are inputed yet, can't choose operation*/
        return state    
      }
      if (state.previousOperand == null){  /*if currentOperand is not null, replace its operation with payload.operation*/
        return{
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      if (state.currentOperand == null){
        return{
          ...state,
          operation: payload.operation
          
        }
      }
      return{    /*default operation will be to evaluate, then use answer as new previous operand, like a real calculator*/
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation

      }

      
    case ACTIONS.CLEAR:
      return {}  /* simply return an empty state*/

    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null){
        return state  /*if info is missing return state*/
      }
      return{
        ...state,
        overwrite: true,  /*in a real calculator, if you add a digit after evaluating, it will replace the currentOperand*/
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return{
          ...state,
          currentOperand: null,
          operation: null,
          overwrite:false
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
        
      }
      
    }

    
  }



function evaluate({currentOperand, previousOperand, operation}) {
  if (operation === '+'){
    return parseFloat(previousOperand) + parseFloat(currentOperand) 
  }
  if (operation === '-'){
    return parseFloat(previousOperand) - parseFloat(currentOperand) 
  }
  if (operation === 'x'){
    return parseFloat(previousOperand) * parseFloat(currentOperand) 
  }
  if (operation === '÷'){
    return parseFloat(previousOperand) / parseFloat(currentOperand)
  }
}

/* Basic HTML layout */
function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})
  /**state is the value stored in a variable at a point in time, 
   dispatch is a function used to dispatch actions to update the state
   reducer is a function that specifies how the state should change in response to dispatch*/     

  
  return (
    <div className='calculator-grid'> 
      <div className='calculator-display-screen'> 
        <div className='previous-operand'>{previousOperand} {operation}</div>
        <div className='current-operand'>{currentOperand}</div>
      </div>
      <button className='two-wide' onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation='÷' dispatch={dispatch}></OperationButton>
      <DigitButton digit='1' dispatch={dispatch}></DigitButton>
      <DigitButton digit='2' dispatch={dispatch}></DigitButton>
      <DigitButton digit='3' dispatch={dispatch}></DigitButton>
      <OperationButton operation='x' dispatch={dispatch}></OperationButton>
      <DigitButton digit='4' dispatch={dispatch}></DigitButton>
      <DigitButton digit='5' dispatch={dispatch}></DigitButton>
      <DigitButton digit='6' dispatch={dispatch}></DigitButton>
      <OperationButton operation='+' dispatch={dispatch}></OperationButton>
      <DigitButton digit='7' dispatch={dispatch}></DigitButton>
      <DigitButton digit='8' dispatch={dispatch}></DigitButton>
      <DigitButton digit='9' dispatch={dispatch}></DigitButton>
      <OperationButton operation='-' dispatch={dispatch}></OperationButton>
      <DigitButton digit='.' dispatch={dispatch}></DigitButton>
      <DigitButton digit='0' dispatch={dispatch}></DigitButton>
      

      <button className='two-wide' onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
    </div>

  )
}

export default App;

/* made following Web Dev Simplified Tutorial */
