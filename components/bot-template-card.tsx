"use client"

import { type BotTemplate } from "@/lib/bot-templates"
import { cn } from "@/lib/utils"
import {
  Cloud,
  Quote,
  DollarSign,
  Bell,
  Star,
  Lightbulb,
  Check,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  Cloud,
  Quote,
  DollarSign,
  Bell,
  Star,
  Lightbulb,
}

interface BotTemplateCardProps {
  template: BotTemplate
  onSelect: () => void
}

export function BotTemplateCard({ template, onSelect }: BotTemplateCardProps) {
  const Icon = iconMap[template.icon] || Cloud

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300",
        "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-6 pb-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
          <span className="mt-1 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {template.category}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 pb-4">
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 pb-4">
        <ul className="space-y-2">
          {template.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* API Notice */}
      {template.requiredApi && (
        <div className="mx-6 mb-4 rounded-lg bg-secondary/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            Требуется: {template.requiredApi}
          </p>
        </div>
      )}

      {/* Action */}
      <div className="border-t border-border p-4">
        <button
          onClick={onSelect}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Создать бота
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
