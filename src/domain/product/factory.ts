import type { CreateProductInput, Product } from "./types"
import type { User } from "@/domain/user/types"
import { generateId } from "@/shared/lib/id"
import { today } from "@/shared/lib/date"
import { PLACEHOLDER_IMAGES } from "@/shared/config/placeholders"

export function createProduct(
  input: CreateProductInput,
  wholesaler: User,
): Product {
  return {
    id: generateId("p"),
    wholesalerId: wholesaler.id,
    wholesalerName: wholesaler.name,
    name: input.name,
    description: input.description,
    unitPrice: input.unitPrice,
    currency: input.currency,
    minUnits: input.minUnits,
    image: input.image || PLACEHOLDER_IMAGES.product,
    category: input.category,
    available: true,
    createdAt: today(),
  }
}
