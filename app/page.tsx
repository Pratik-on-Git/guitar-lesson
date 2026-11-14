import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Play } from "lucide-react";
import { AudienceToggle } from "@/components/site/audience-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * Stand-in for full-bleed photography: deep blacks under warm, incandescent light.
 * Swap for a real photo, e.g. `url("/hero.jpg") center / cover`, and keep the scrim.
 */
const WARM_DARK_PHOTO =
  "radial-gradient(55% 65% at 28% 30%, rgba(214,140,80,0.42), transparent 70%), " +
  "radial-gradient(45% 55% at 78% 72%, rgba(170,88,36,0.30), transparent 70%), " +
  "linear-gradient(180deg, #1c130c 0%, #0a0806 60%, #050505 100%)";

const STYLE_CHIPS = [
  "Fingerstyle",
  "Blues",
  "Acoustic basics",
  "Jazz chords",
  "Rock riffs",
  "Classical",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
        <PopularStrip />
        <Manifesto />
        <Features />
        <ClosingCta />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-page items-center justify-between gap-4 px-4 py-4 sm:px-6">
      <Link
        href="/"
        className="font-display text-heading font-medium text-charcoal-ink"
      >
        guitar lesson
      </Link>
      <AudienceToggle className="hidden md:inline-flex" />
      <nav className="flex items-center gap-1">
        <a
          href="#sign-in"
          className="hidden rounded-lg px-2 py-2 text-caption font-medium text-charcoal-ink hover:underline sm:inline-block"
        >
          Sign in
        </a>
        <a href="#book" className={buttonVariants()}>
          Book a lesson
        </a>
      </nav>
    </header>
  );
}

function EmberDot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block rounded-full bg-ember", className)}
    />
  );
}

function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[640px] items-center justify-center overflow-hidden px-4 py-24 text-center"
      style={{ background: WARM_DARK_PHOTO }}
    >
      <div className="absolute inset-0 -z-10 bg-pressed-graphite/30" />
      <div className="flex w-full max-w-[720px] flex-col items-center">
        <h1 className="text-[44px] leading-[1.1] text-white sm:text-[56px] lg:text-display">
          Learn the songs you love
          <EmberDot className="ml-[0.06em] size-[0.16em] align-baseline" />
        </h1>
        <p className="mt-5 max-w-[520px] text-subheading text-white/90">
          One-to-one lessons with teachers matched to your level, your hands and
          the music you actually want to play.
        </p>

        <form
          role="search"
          action="/"
          className="mt-10 flex w-full max-w-[560px] items-center gap-2 rounded-xl border border-fog bg-white py-2 pr-2 pl-5 shadow-soft"
        >
          <label htmlFor="hero-search" className="sr-only">
            What do you want to play?
          </label>
          <input
            id="hero-search"
            name="q"
            type="search"
            placeholder="What do you want to play?"
            className="min-w-0 flex-1 bg-transparent text-body text-near-black outline-none placeholder:text-stone"
          />
          <button
            type="submit"
            aria-label="Find a teacher"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-charcoal-ink text-white transition-opacity hover:opacity-85 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            <ArrowRight className="size-4.5" strokeWidth={1.75} />
          </button>
        </form>

        <a
          href="#quiz"
          className="mt-3 text-caption font-medium text-white hover:underline"
        >
          I&apos;m not sure
        </a>
      </div>
    </section>
  );
}

function PopularStrip() {
  return (
    <section className="mx-auto flex w-full max-w-page flex-col gap-5 px-4 pt-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <p className="flex items-center gap-2 text-caption font-medium text-charcoal-ink">
        <EmberDot className="size-2" />
        1,284 lessons booked this week
      </p>
      <ul className="flex flex-wrap gap-2" aria-label="Popular styles">
        {STYLE_CHIPS.map((chip) => (
          <li key={chip}>
            <Link
              href={{ pathname: "/", query: { q: chip } }}
              className="inline-block rounded-full border border-fog bg-white px-4 py-2.5 text-caption font-medium text-charcoal-ink transition-colors hover:border-slate"
            >
              {chip}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="mx-auto grid w-full max-w-page gap-6 px-4 pt-25 pb-18 sm:px-6 md:grid-cols-2 md:gap-14.5">
      <h2 className="max-w-[520px] text-heading text-charcoal-ink">
        Most people put the guitar down within a year. Not because it&apos;s
        hard, but because they practise the wrong things.
      </h2>
      <div className="flex max-w-[500px] flex-col gap-4 text-body text-slate">
        <p>
          We pair you with one teacher who listens to how you play today and
          builds every lesson around the songs that made you pick it up.
        </p>
        <p>
          Between lessons, they hear your practice takes and tell you exactly
          what to fix next. Fifteen focused minutes a day beats an aimless hour.
        </p>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="mx-auto w-full max-w-page px-4 pb-25 sm:px-6"
    >
      <h2 id="features-heading" className="sr-only">
        How it works
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          title="Matched to your hands"
          body="Not just your genre. Teachers are matched on level, goals and the way you learn best."
          mockup={<MatchMockup />}
        />
        <FeatureCard
          title="Feedback between lessons"
          body="Send a practice take any day. Your teacher replies with the one thing to fix next."
          mockup={<ChatMockup />}
        />
        <FeatureCard
          title="Hear yourself improve"
          body="Every technique you work on is tracked, so progress you can't feel yet still shows."
          mockup={<ProgressMockup />}
        />
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  body,
  mockup,
}: {
  title: string;
  body: string;
  mockup: ReactNode;
}) {
  return (
    <article className="flex flex-col gap-8 rounded-card bg-white p-8 shadow-soft">
      <div
        aria-hidden
        className="flex min-h-[208px] flex-col justify-center gap-3 rounded-2xl bg-cream-paper/60 p-4"
      >
        {mockup}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-heading-sm text-charcoal-ink">{title}</h3>
        <p className="text-body text-slate">{body}</p>
      </div>
    </article>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-pressed-graphite text-[12px] font-semibold text-white">
      {initials}
    </span>
  );
}

function MatchMockup() {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border border-fog bg-white px-3 py-2.5 text-caption text-near-black">
        Fingerstyle, beginner
        <ArrowRight className="size-3.5 text-slate" strokeWidth={1.75} />
      </div>
      <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-soft">
        <Avatar initials="MR" />
        <div className="min-w-0 flex-1">
          <p className="text-caption font-semibold text-near-black">Maya R.</p>
          <p className="mt-1 truncate text-[12px] text-stone">
            12 yrs teaching · Folk, Fingerstyle
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-fog px-2.5 py-1 text-[12px] font-medium text-near-black">
          <EmberDot className="size-1.5" />
          91% match
        </span>
      </div>
    </>
  );
}

function ChatMockup() {
  return (
    <>
      <div className="flex items-start gap-2.5">
        <Avatar initials="MR" />
        <p className="rounded-xl rounded-tl-sm bg-white px-3 py-2.5 text-caption leading-[1.4] text-near-black">
          Nice take. Slow the F to C change to 60 bpm and send me one more
          tomorrow.
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-fog bg-white py-1.5 pr-1.5 pl-3">
        <Play className="size-3.5 text-slate" strokeWidth={1.75} />
        <span className="flex-1 text-caption text-stone">
          Practice take, 0:42
        </span>
        <span className="grid size-7 place-items-center rounded-full bg-charcoal-ink text-white">
          <ArrowUp className="size-3.5" strokeWidth={2} />
        </span>
      </div>
    </>
  );
}

const SKILLS = [
  { name: "Barre chords", value: 72 },
  { name: "16th-note strumming", value: 54 },
  { name: "Pentatonic box 1", value: 88 },
];

function ProgressMockup() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <Avatar initials="YO" />
        <div>
          <p className="text-caption font-semibold text-near-black">You</p>
          <p className="mt-1 text-[12px] text-stone">Week 14 · 38 lessons</p>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {SKILLS.map((skill) => (
          <li key={skill.name}>
            <div className="flex justify-between text-[12px] text-iron">
              <span>{skill.name}</span>
              <span className="tabular-nums">{skill.value}%</span>
            </div>
            <div className="mt-1.5 h-1 rounded-full bg-fog/60">
              <div
                className="h-full rounded-full bg-pressed-graphite"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClosingCta() {
  return (
    <section id="book" className="mx-auto w-full max-w-page px-4 pb-25 sm:px-6">
      <div
        className="relative isolate flex min-h-[440px] flex-col items-center justify-end overflow-hidden rounded-card px-6 pb-14.5 text-center"
        style={{ background: WARM_DARK_PHOTO }}
      >
        <div className="absolute inset-0 -z-10 bg-pressed-graphite/40" />
        <h2 className="text-heading text-white">
          Your first lesson is on us
        </h2>
        <p className="mt-2 max-w-[440px] text-body text-white/80">
          Thirty minutes with a matched teacher. Bring a guitar and one song
          you&apos;d love to play.
        </p>
        <a
          href="#book"
          className={cn(buttonVariants({ variant: "inverse" }), "mt-8")}
        >
          Book a free lesson
        </a>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-page px-4 sm:px-6">
      <div className="flex flex-col gap-3 border-t border-fog py-8 text-caption text-slate sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Guitar Lesson</p>
        <nav className="flex gap-6">
          <a href="#teach" className="hover:text-charcoal-ink">
            Teach with us
          </a>
          <a href="#privacy" className="hover:text-charcoal-ink">
            Privacy
          </a>
          <a href="#terms" className="hover:text-charcoal-ink">
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
