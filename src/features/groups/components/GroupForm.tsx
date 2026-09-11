import type { FormEvent } from "react"
import {
  Button,
  Card,
  InfoBanner,
  Input,
  SectionTitle,
  Select,
  SuccessMessage,
  Textarea,
} from "@/shared/ui"
import { CurrencySelect } from "@/components"
import { Icon } from "@/shared/icons/Icon"
import { useFormState } from "@/shared/hooks"
import { IMPORT_CATEGORY, PRODUCT_CATEGORIES } from "@/shared/config/categories"
import { toFloat, toInt } from "@/shared/lib/number"
import type { CreateGroupInput, Currency, GroupType } from "@/domain"

export interface GroupFormProps {
  type: GroupType
  onSubmit: (input: CreateGroupInput) => void
  onCancel: () => void
  success: boolean
}

interface VariantCopy {
  namePlaceholder: string
  descPlaceholder: string
  priceLabel: string
  unitsLabel: string
  depositLabel: string
  deadlineLabel: string
  submitLabel: string
  successLabel: string
  defaultDeposit: number
  defaultUnits: number
  noteTitle: string
  note: string
}

/** Textos y valores por defecto que cambian entre Panal local y de importación. */
const VARIANT: Record<GroupType, VariantCopy> = {
  local: {
    namePlaceholder: "Ej. Aceite de oliva 1L",
    descPlaceholder: "Describe el producto, la calidad y el proveedor...",
    priceLabel: "Precio por celda *",
    unitsLabel: "Celdas del Panal *",
    depositLabel: "Depósito de seriedad *",
    deadlineLabel: "Fecha de cierre",
    submitLabel: "Fundar el Panal",
    successLabel: "Tu Panal está abierto. Ahora a reunir Abejas.",
    defaultDeposit: 10,
    defaultUnits: 100,
    noteTitle: "Depósito de seriedad:",
    note: "asegura que cada Abeja va en serio. Si el Panal no se llena antes del cierre, el Honey vuelve a cada reserva.",
  },
  international: {
    namePlaceholder: "Ej. Auriculares TWS Bluetooth",
    descPlaceholder:
      "Especificaciones, calidad, tiempos de entrega estimados...",
    priceLabel: "Precio por celda (HNY) *",
    unitsLabel: "Celdas mínimas del proveedor *",
    depositLabel: "Depósito de seriedad *",
    deadlineLabel: "Fecha de cierre",
    submitLabel: "Fundar el Panal de importación",
    successLabel:
      "Tu Panal de importación está abierto. Ahora a reunir Abejas.",
    defaultDeposit: 15,
    defaultUnits: 100,
    noteTitle: "Panal de importación:",
    note: "incluye envío y aduana en el precio por celda. El depósito protege a todas las Abejas del Panal.",
  },
}

export default function GroupForm({
  type,
  onSubmit,
  onCancel,
  success,
}: GroupFormProps) {
  const v = VARIANT[type]
  const isIntl = type === "international"
  const { form, bind, setField } = useFormState({
    productName: "",
    description: "",
    productLink: "",
    supplierName: "",
    imageUrl: "",
    pickupPoint: "",
    targetUnits: "",
    unitPrice: "",
    currency: "HNY" as Currency,
    entryDeposit: "",
    deadline: "",
    category: PRODUCT_CATEGORIES[0] as string,
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({
      type,
      productName: form.productName,
      description: form.description,
      productLink: isIntl ? form.productLink : undefined,
      supplierName: form.supplierName || undefined,
      imageUrl: form.imageUrl,
      pickupPoint: form.pickupPoint || "Por definir",
      targetUnits: toInt(form.targetUnits, v.defaultUnits),
      unitPrice: toFloat(form.unitPrice, 1),
      currency: form.currency,
      entryDeposit: toFloat(form.entryDeposit, v.defaultDeposit),
      category: isIntl ? IMPORT_CATEGORY : form.category,
      deadline: form.deadline || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Card className="p-6 flex flex-col gap-4">
        <SectionTitle>Producto</SectionTitle>
        <Input
          label="Nombre del producto *"
          placeholder={v.namePlaceholder}
          required
          {...bind("productName")}
        />
        {isIntl && (
          <Input
            label="Enlace del producto (Alibaba u otro) *"
            placeholder="https://www.alibaba.com/..."
            required
            {...bind("productLink")}
          />
        )}
        <Input
          label="Proveedor"
          placeholder={
            isIntl ? "Ej. Shenzhen Lights" : "Ej. Distribuidora Pérez"
          }
          {...bind("supplierName")}
        />
        <Textarea
          label="Descripción"
          placeholder={v.descPlaceholder}
          rows={3}
          {...bind("description")}
        />
        {!isIntl && (
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
        )}
        <Input
          label="URL de imagen (opcional)"
          placeholder="https://..."
          {...bind("imageUrl")}
        />
      </Card>

      <Card className="p-6 flex flex-col gap-4">
        <SectionTitle>Condiciones del Panal</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={v.priceLabel}
            type="number"
            step="0.01"
            placeholder="4,50"
            required
            {...bind("unitPrice")}
          />
          <CurrencySelect
            label="Moneda"
            value={form.currency}
            onChange={(c) => setField("currency", c)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label={v.unitsLabel}
            type="number"
            placeholder="100"
            required
            {...bind("targetUnits")}
          />
          <Input
            label={v.depositLabel}
            type="number"
            step="0.01"
            placeholder="20,00"
            required
            {...bind("entryDeposit")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Punto de retiro del primer Enjambre"
            placeholder="Ej. Chacao"
            hint="Podrás añadir más Enjambres después."
            {...bind("pickupPoint")}
          />
          <Input label={v.deadlineLabel} type="date" {...bind("deadline")} />
        </div>
      </Card>

      <InfoBanner title={v.noteTitle} icon={<Icon.shield size={16} />}>
        {v.note}
      </InfoBanner>

      {success ? (
        <SuccessMessage>{v.successLabel}</SuccessMessage>
      ) : (
        <div className="flex gap-3">
          <Button type="submit" size="lg">
            {v.submitLabel}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-secondary-foreground"
          >
            Cancelar
          </Button>
        </div>
      )}
    </form>
  )
}
