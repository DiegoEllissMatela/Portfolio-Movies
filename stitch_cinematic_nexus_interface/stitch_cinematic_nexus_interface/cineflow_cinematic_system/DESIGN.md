---
name: CineFlow Cinematic System
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c6c6ca'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8f9195'
  outline-variant: '#45474a'
  surface-tint: '#c5c6cb'
  primary: '#c5c6cb'
  on-primary: '#2e3134'
  primary-container: '#05070a'
  on-primary-container: '#76787d'
  inverse-primary: '#5c5e63'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00080b'
  on-tertiary-container: '#00849a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e2e7'
  primary-fixed-dim: '#c5c6cb'
  on-primary-fixed: '#191c1f'
  on-primary-fixed-variant: '#44474b'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 72px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Sora
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 40px
  gutter: 24px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built to evoke the immersive, high-fidelity atmosphere of a premium cinema. The brand personality is **Immersive, Fluid, and Mysterious**, prioritizing content-first experiences where the UI recedes into the background until needed.

The visual style is a sophisticated blend of **Glassmorphism** and **Modern Minimalism**. It relies on depth, light, and motion rather than structural lines to define hierarchy. Every interaction should feel like a fluid transition through a digital theater, using soft glowing accents and translucent layers to maintain a sense of infinite space.

**Key Principles:**
- **Content is the Hero:** Imagery should be large, high-definition, and often bleed into the background.
- **Luminosity over Borders:** Use light sources (glows/gradients) to define interactive zones instead of solid strokes.
- **Fluidity:** Motion should be eased and organic, mimicking the shutter speed of a film camera.

## Colors

The palette is strictly dark-mode centric to ensure the "lights out" cinematic feel. 

- **Primary (Midnight Blue):** Used for the base canvas. It is near-black but retains enough blue pigment to prevent a "flat" appearance.
- **Accent 1 (Electric Violet):** Used for primary actions, progress indicators, and active states. It represents the energy of the stream.
- **Accent 2 (Cyber Cyan):** Used for secondary highlights, labels, and metadata that require immediate scanning.
- **Surface (Glass):** A semi-transparent overlay that provides a "frosted" look, allowing the vibrant colors of movie posters to bleed through subtly.

## Typography

This design system utilizes **Sora** for headings to achieve a wide, tech-forward, and cinematic presence. Its geometric structure feels intentional and high-fidelity. For body copy, **Plus Jakarta Sans** provides a friendly yet precise reading experience that remains legible at smaller sizes on dark backgrounds.

**Styling Rules:**
- **Headlines:** Use tight letter-spacing on larger sizes to create a "blockbuster" poster feel.
- **Body:** Increase line-height slightly to 1.6x for better readability against high-contrast backgrounds.
- **Labels:** Always use uppercase with slight tracking (0.05em) for metadata like "4K", "HDR", or "GENRE".

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous "breathing room" to maintain the premium feel.

- **Desktop (1440px+):** 12-column grid, 40px margins, 24px gutters.
- **Tablet (768px - 1439px):** 8-column grid, 32px margins, 16px gutters.
- **Mobile (<768px):** 4-column grid, 20px margins, 16px gutters.

**Rhythm:** Spacing between related movie cards should be tight (stack-md), while spacing between major genres or sections should be expansive (section-gap) to allow users to focus on one category at a time.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Luminous Depth**.

1.  **Base Layer:** Midnight Blue (#05070A).
2.  **Surface Layer:** Glassmorphism layers using `backdrop-filter: blur(20px)` and a 1px border with a `linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`.
3.  **Active Layer:** Elements on this layer feature a "soft glow" (box-shadow: 0 0 30px rgba(139, 92, 246, 0.3)).

Interactive elements should appear to float above the background imagery, separated by the frosted blur effect rather than heavy shadows.

## Shapes

The shape language is **Rounded (Level 2)**. This strikes a balance between the precision of technology and the approachability of entertainment.

- **Default (0.5rem):** Used for buttons, input fields, and small UI chips.
- **Large (1rem):** Used for movie posters, thumbnails, and card containers.
- **Extra Large (1.5rem):** Used for modal overlays and large feature hero banners.

Avoid sharp corners completely to maintain the "fluid" brand essence.

## Components

### Buttons
- **Primary:** Gradient background (Electric Violet to Cyber Cyan), white text, no border. On hover, increase the glow intensity.
- **Secondary (Glass):** Transparent background with `backdrop-filter: blur(10px)` and a subtle 1px white-alpha border.

### Movie Cards
- **Structure:** Edge-to-edge imagery with a 1rem border radius.
- **Hover State:** Scale the card by 1.05x, apply an Electric Violet outer glow, and reveal metadata via a glassmorphism overlay at the bottom of the card.

### Input Fields
- **Style:** Underlined or semi-transparent fill with a Cyber Cyan focus ring.
- **Micro-copy:** Use Muted Silver for placeholders to maintain low visual noise.

### Progress Bars (Video Player)
- **Track:** 4px height, Midnight Blue base.
- **Fill:** Electric Violet gradient.
- **Handle:** A luminous white dot with a Cyber Cyan shadow that appears only on scrub.

### Tags / Chips
- **Style:** Small, pill-shaped containers with a very subtle Cyber Cyan tint (rgba(6, 182, 212, 0.1)) and matching text.