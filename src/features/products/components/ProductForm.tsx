import type { FormEvent } from "react"
import {
  Button,
  Card,
  Input,
  SectionTitle,
  Select,
  SuccessMessage,
  Textarea,
} from "@/shared/ui"
import { CurrencySelect } from "@/components"
import { useFormState } from "@/shared/hooks"
import { PRODUCT_CATEGORIES } from "@/shared/config/categories"
import { toFloat, toInt } from "@/shared/lib/number"
import type { CreateProductInput, Currency } from "@/domain"

export interface ProductFormProps {
  onSubmit: (input: CreateProductInput) => void
  onCancel: () => void
  success: boolean
}

const DEFAULT_MIN_UNITS = 50

export default function ProductForm({
  onSubmit,
  onCancel,
  success,
}: ProductFormProps) {
  const { form, bind, setField } = useFormState({
    name: "",
    description: "",
    unitPrice: "",
    currency: "HNY" as Currency,
    minUnits: "",
    image: "",
    category: PRODUCT_CATEGORIES[0] as string,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      name: form.name,
      description: form.description,
      unitPrice: toFloat(form.unitPrice, 1),
      currency: form.currency,
      minUnits: toInt(form.minUnits, DEFAULT_MIN_UNITS),
      image: form.image,
      category: form.category,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card className="p-6 flex flex-col gap-4">
        <Input
          label="Nombre del producto *"
          placeholder="Ej. Aceite de girasol 5L"
          required
          {...bind("name")}
        />
        <Textarea
          label="Descripción *"
          placeholder="Detalla el producto: origen, características, empaque..."
          rows={3}
          {...bind("description")}
        />
        <Select
          label="Categoría"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Input
          label="URL de foto del producto"
          placeholder="https://..."
          {...bind("image")}
        />
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <SectionTitle>Precio y disponibilidad</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Precio por celda *"
            type="number"
            step="0.01"
            placeholder="5,00"
            required
            {...bind("unitPrice")}
          />
          <CurrencySelect
            value={form.currency}
            onChange={(c) => setField("currency", c)}
          />
        </div>
        <Input
          label="Celdas mínimas por Panal *"
          type="number"
          placeholder="50"
          required
          {...bind("minUnits")}
        />
      </Card>

      {success ? (
        <SuccessMessage>
          Producto publicado. Las Abejas ya pueden fundar Panales con él.
        </SuccessMessage>
      ) : (
        <div className="flex gap-3">
          <Button type="submit" variant="accent" size="lg">
            Publicar producto
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      )}
    </form>
  )
}
