import { useReducer } from "react"
import {
 variantReducer,
 initialVariantState
} from "../reducers/variantReducer"

export function useVariantManager() {

 const [state, dispatch] = useReducer(
  variantReducer,
  initialVariantState
 )

 const setMarketplace = (id: string) => {
  dispatch({
   type: "SET_MARKETPLACE",
   payload: id
  })
 }

 const togglePricingForm = (value: boolean) => {
  dispatch({
   type: "TOGGLE_FORM",
   payload: value
  })
 }

 const addPricing = (pricing: any) => {
  dispatch({
   type: "ADD_PRICING",
   payload: pricing
  })
 }

 const removePricing = (id: string) => {
  dispatch({
   type: "REMOVE_PRICING",
   payload: id
  })
 }

 return {
  state,
  dispatch,
  setMarketplace,
  togglePricingForm,
  addPricing,
  removePricing
 }
}