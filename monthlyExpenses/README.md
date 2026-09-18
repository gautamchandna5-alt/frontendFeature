## Overview
This project is an interactive, scroll-triggered expense breakdown dashboard. It focuses on rendering complex SVG animations at 60fps, utilizing modern CSS features, and implementing a strict Suspense-driven data architecture. 

Rather than a pixel-perfect clone of the reference video, I focused on structural integrity: building a data-agnostic, responsive layout with fluid typography, mathematically perfect SVG charts, and a robust caching layer.

## Architecture & Technologies
* **Framework:** React 18 (Vite)
* **Data State:** TanStack Query v5
* **Styling:** Tailwind CSS v4 (Custom Theme configuration)
* **Animation:** Framer Motion

## Design Token Architecture
Hardcoded hex values are completely avoided in the component tree and data layer. 
* All foundational colors are defined as CSS variables in `index.css`.
* Using Tailwind v4's `@theme` directive, these variables generate the utility classes (`bg-brand-primary`, `text-chart-1`).
* The data adapter references these CSS variables directly (`var(--color-chart-1)`), ensuring the JavaScript logic strictly inherits from the global design system.

## Data Fetching & Caching Strategy
I implemented a **Data Adapter Pattern** combined with a **Suspense-driven caching layer**.

1. **The Adapter:** To satisfy the public API requirement without compromising the logical UI of a household dashboard, the app fetches randomized `stock` values from `DummyJSON`. The adapter maps these real, randomized network values as variance modifiers onto stable baseline budgets (Rent, Utilities, etc.). This ensures network latency and asynchronous loading are handled while keeping the pie chart math mathematically valid and visually coherent.
2. **Caching (TanStack Query v5):** The app uses `useSuspenseQuery` to strip loading state boilerplate (`if (isLoading)`) from the UI components. React natively pauses rendering at the `<Suspense>` boundary until the network resolves. 
3. **Session Stability:** `staleTime` is configured to 5 minutes and `refetchOnWindowFocus` is disabled. This guarantees that as the user navigates between months, the data remains rock-solid and cached in memory, eliminating redundant network waterfalls.

## Animation Craft & Performance
The animations are designed to be purposeful, physics-based, and highly performant.
* **Render-Free Counting:** The `AnimatedNumber` component uses Framer Motion's `useMotionValue`, `useSpring`, and `useTransform`. This updates the DOM directly outside of React's state tree, allowing the numbers to tick at 60fps without triggering costly component re-renders.
* **Decoupled Hitboxes (Strobe-Prevention):** Hovering near the inner edge of an expanding SVG can cause a flickering hover-loop. I solved this by decoupling the physical hit area (a stationary, invisible `<circle>` with a wide `strokeWidth`) from the visual slices (a `pointerEvents: 'none'` group that translates radially).
* **Polar Math Translations:** Slice expansion doesn't rely on scaling or changing the radius (which alters the circumference math). Instead, it calculates the exact angle using polar coordinates (`Math.cos` / `Math.sin`) to translate the SVG group perfectly outward along its radial axis.

## Modern CSS Integrations
* **Fluid Typography:** Used `clamp(1.5rem, 4vw, 2.25rem)` for the main heading, allowing it to scale naturally across viewports without rigid media queries.
* **Component Queries:** The right-hand chart panel utilizes Tailwind's `@container` context to ensure the internal layout shifts intelligently based on the panel's actual width, rather than the global screen size.
* **Parent-Aware Styling:** Implemented the `:has()` selector on the sidebar (`has-[:hover]:bg-slate-50/30`). If a user hovers over *any* specific month button, the parent container subtly dims the surrounding background.

## Accessibility (a11y)
* **Semantic HTML:** The layout relies on `<section>`, `<aside>`, and `<main>` landmarks rather than generic `<div>` wrappers.
* **Reduced Motion:** Integrated `useReducedMotion` to automatically detect the user's OS-level accessibility preferences. If enabled, the spring physics and drawing durations are instantly zeroed out, respecting the user's settings.
* **Keyboard Navigation:** The SVG hitboxes include `tabIndex={0}` and map `onFocus`/`onBlur` to the hover states, ensuring keyboard users receive the exact same visual micro-interactions as mouse users.

## Tradeoffs & Future Improvements (With 6-8 more hours)
1. **Dark Mode Implementation:** I would expand the CSS variables in `index.css` with an `@media (prefers-color-scheme: dark)` block and a state toggle. The token architecture is already perfectly set up to handle this instantly.
2. **Error Boundaries:** While Suspense handles the loading states cleanly, I would implement `react-error-boundary` around the widgets to provide granular, localized fallback UIs if the DummyJSON network request fails, rather than failing the whole page.
3. **E2E Testing:** I would write a quick Playwright suite to verify the hover calculations and ensure the SVG coordinates don't break under different viewport stresses.