import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion'

export function FaqItem({
  q,
  a,
  index,
}: {
  q: string
  a: string
  index: string
}) {
  return (
    <AccordionItem
      value={q}
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
      className="border-t border-border not-last:border-b-0"
    >
      <AccordionTrigger className="group gap-4 rounded-none py-5 hover:no-underline">
        <span className="tnum mt-1 font-mono text-[11px] tracking-[0.1em] text-hint/60">
          {index}
        </span>
        <span
          itemProp="name"
          className="flex-1 text-[15px] font-medium text-foreground group-hover:text-foreground"
        >
          {q}
        </span>
      </AccordionTrigger>
      <AccordionContent
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
        className="text-[13.5px] leading-[1.75]"
      >
        <p
          itemProp="text"
          className="max-w-2xl pb-5 pl-9 text-muted-foreground"
        >
          {a}
        </p>
      </AccordionContent>
    </AccordionItem>
  )
}
