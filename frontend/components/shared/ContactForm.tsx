"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Palette,
  PenTool,
  Code2,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import { formServices, contact } from "@/data/contact";
import Button from "@/components/shared/Button";
import TiltCard from "@/components/animations/TiltCard";

type FormState = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  company: "",
  service: "",
  message: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

const serviceIcons: Record<string, React.ElementType> = {
  Branding: Palette,
  "UI/UX Design": PenTool,
  "Website Development": Code2,
  "Digital Marketing": Megaphone,
  Other: ChevronDown,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

import { submitContactInquiry } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState(false);

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please add your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please add a valid email.";
    if (!form.service) next.service = "Pick the service you're interested in.";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Tell us a little more (at least 10 characters).";
    return next;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    setApiError(false);
    try {
      await submitContactInquiry(form);
      setSent(true);
    } catch {
      // Backend unreachable — keep the form filled and offer a direct email fallback.
      setApiError(true);
    }
  };
  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-start gap-6 overflow-hidden rounded-3xl border border-accent/30 bg-accent/5 p-10"
      >
        <span
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-[#0e0e0e] shadow-[0_0_40px_rgba(255,77,31,0.5)]"
        >
          <CheckCircle2 className="h-7 w-7" />
        </motion.span>
        <h2 className="display text-3xl font-bold tracking-tight text-ink">
          Message received.
        </h2>
        <p className="max-w-md text-sm leading-relaxed text-muted">
          Thanks for reaching out — we&apos;ll get back to you within one business
          day. Meanwhile, you can also write to us directly at{" "}
          <a
            href={`mailto:${contact.email}`}
            className="text-accent underline underline-offset-4"
          >
            {contact.email}
          </a>
          .
        </p>
        <button
          onClick={() => {
            setForm(emptyForm);
            setSent(false);
          }}
          className="text-sm font-bold text-accent transition-opacity hover:opacity-70"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full border-b-2 bg-transparent px-1 pb-3 pt-2 text-lg text-ink placeholder:text-ink/25 transition-colors duration-300 focus:outline-none ${
      hasError ? "border-red-500/60" : "border-ink/15 focus:border-accent"
    }`;

  const labelClass = "mb-3 block font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted";

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      className="aurora-border relative p-8 md:p-12"
    >
      <div className="relative z-10 flex flex-col gap-9">
        <motion.div variants={fadeUp}>
          <span className="eyebrow text-accent">Project inquiry</span>
          <h2 className="display mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
            Tell us about your project.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <motion.div variants={fadeUp}>
            <label htmlFor="cf-name" className={labelClass}>
              Your name <span className="text-accent">*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Doe"
              className={inputClass(!!errors.name)}
              aria-invalid={!!errors.name}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div variants={fadeUp}>
            <label htmlFor="cf-email" className={labelClass}>
              Email <span className="text-accent">*</span>
            </label>
            <input
              id="cf-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="jane@company.com"
              className={inputClass(!!errors.email)}
              aria-invalid={!!errors.email}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 text-xs text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.div variants={fadeUp} className="md:col-span-2">
            <label htmlFor="cf-company" className={labelClass}>
              Company
            </label>
            <input
              id="cf-company"
              type="text"
              value={form.company}
              onChange={set("company")}
              placeholder="Company name (optional)"
              className={inputClass(false)}
            />
          </motion.div>
        </div>

        <motion.div variants={fadeUp}>
          <span className={labelClass}>
            What do you need? <span className="text-accent">*</span>
          </span>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {formServices.map((s) => {
              const Icon = serviceIcons[s] ?? ChevronDown;
              const active = form.service === s;
              return (
                <TiltCard
                  key={s}
                  className="rounded-xl"
                  maxTilt={8}
                  glowColor="rgba(255, 77, 31, 0.2)"
                  shadow={false}
                >
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, service: s }))}
                    aria-pressed={active}
                    className={`group relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-xl border p-5 text-left transition-all duration-300 ${
                      active
                        ? "border-accent bg-accent text-[#0e0e0e] shadow-[0_10px_30px_rgba(255,77,31,0.35)]"
                        : "border-ink/10 bg-card/60 text-ink hover:border-accent/50"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                        active ? "text-[#0e0e0e]" : "text-accent"
                      }`}
                    />
                    <span className="text-sm font-semibold">{s}</span>
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-[#0e0e0e] text-accent"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </motion.span>
                    )}
                    <span
                      className="pointer-events-none absolute inset-y-0 left-[-45%] w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-[100%] group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </button>
                </TiltCard>
              );
            })}
          </div>
          <AnimatePresence>
            {errors.service && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-red-400"
              >
                {errors.service}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        
        <motion.div variants={fadeUp}>
          <div className="flex items-end justify-between">
            <label htmlFor="cf-message" className={labelClass}>
              The story <span className="text-accent">*</span>
            </label>
            <span className="mb-1 font-mono text-[10px] text-muted">
              {form.message.trim().length} chars
            </span>
          </div>
          <textarea
            id="cf-message"
            rows={5}
            value={form.message}
            onChange={set("message")}
            placeholder="Tell us about your business, the project and your goals…"
            className={`${inputClass(!!errors.message)} resize-none`}
            aria-invalid={!!errors.message}
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 text-xs text-red-400"
              >
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4">
          <Button type="submit" variant="primary" size="lg">
            Send the message
          </Button>
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            Response within 1 business day
          </span>
        </motion.div>

        <AnimatePresence>
          {apiError && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400"
            >
              Something went wrong and we couldn&apos;t send your message. Please
              try again, or email us directly at{" "}
              <a
                href={`mailto:${contact.email}`}
                className="underline underline-offset-4"
              >
                {contact.email}
              </a>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}