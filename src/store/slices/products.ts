import type { Product } from "@/domain"
import type { AppAction } from "../types"

export interface AddProductAction {
  type: "products/add"
  product: Product
}

export type ProductsAction = AddProductAction

export const productsActions = {
  add: (product: Product): ProductsAction => ({
    type: "products/add",
    product,
  }),
}

export function productsReducer(
  state: Product[],
  action: AppAction,
): Product[] {
  switch (action.type) {
    case "products/add":
      return [...state, action.product]
    default:
      return state
  }
}
