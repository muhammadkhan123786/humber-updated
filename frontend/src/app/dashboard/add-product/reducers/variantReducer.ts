import { ProductVariant, MarketplacePricing } from "../hooks/useProductForm"

export interface VariantState {
  editingVariantId: string | null
  selectedMarketplace: string
  addedMarketplacePricing: MarketplacePricing[]
  showPricingForm: boolean
  pricingHasErrors: boolean
}

export const initialVariantState: VariantState = {
  editingVariantId: null,
  selectedMarketplace: "",
  addedMarketplacePricing: [],
  showPricingForm: false,
  pricingHasErrors: false
}

export type VariantAction =
  | { type: "SET_EDITING"; payload: string | null }
  | { type: "SET_MARKETPLACE"; payload: string }
  | { type: "ADD_PRICING"; payload: MarketplacePricing }
  | { type: "REMOVE_PRICING"; payload: string }
  | { type: "TOGGLE_FORM"; payload: boolean }
  | { type: "SET_PRICING_ERROR"; payload: boolean }
  | { type: "RESET" }

export function variantReducer(
  state: VariantState,
  action: VariantAction
): VariantState {

  switch (action.type) {

    case "SET_EDITING":
      return { ...state, editingVariantId: action.payload }

    case "SET_MARKETPLACE":
      return { ...state, selectedMarketplace: action.payload }

    case "ADD_PRICING":
      return {
        ...state,
        addedMarketplacePricing: [
          ...state.addedMarketplacePricing,
          action.payload
        ]
      }

    case "REMOVE_PRICING":
      return {
        ...state,
        addedMarketplacePricing: state.addedMarketplacePricing.filter(
          p => p.marketplaceId !== action.payload
        )
      }

    case "TOGGLE_FORM":
      return { ...state, showPricingForm: action.payload }

    case "SET_PRICING_ERROR":
      return { ...state, pricingHasErrors: action.payload }

    case "RESET":
      return initialVariantState

    default:
      return state
  }
}