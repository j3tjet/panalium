import { useCallback, useMemo } from "react"
import {
  createProduct,
  productCategories,
  productsByWholesaler,
  type CreateProductInput,
  type Product,
} from "@/domain"
import { productsActions, useAppDispatch, useAppState } from "@/store"
import { useCurrentUser } from "@/features/auth"

export function useProducts() {
  const { products } = useAppState()
  const categories = useMemo(() => productCategories(products), [products])
  return { products, categories }
}

/** Products published by the signed-in wholesaler. */
export function useMyProducts(): Product[] {
  const user = useCurrentUser()
  const { products } = useAppState()
  return useMemo(
    () => productsByWholesaler(products, user.id),
    [products, user.id],
  )
}

export function useProductActions() {
  const user = useCurrentUser()
  const dispatch = useAppDispatch()
  const addProduct = useCallback(
    (input: CreateProductInput) => {
      const product = createProduct(input, user)
      dispatch(productsActions.add(product))
      return product
    },
    [dispatch, user],
  )
  return { addProduct }
}
