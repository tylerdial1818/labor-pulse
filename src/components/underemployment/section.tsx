import type { ReactNode } from "react";

export type UnderemploymentSectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function UnderemploymentSection({ id, title, eyebrow, description, actions, children, className = "" }: UnderemploymentSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-rule py-8 ${className}`} aria-labelledby={`${id}-heading`}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          {eyebrow ? <p className="font-sans text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy">{eyebrow}</p> : null}
          <h2 id={`${id}-heading`} className="mt-2 font-serif text-[30px] font-semibold leading-tight text-ink">
            {title}
          </h2>
          {description ? <p className="mt-2 font-serif text-[16px] leading-[1.48] text-ink">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
