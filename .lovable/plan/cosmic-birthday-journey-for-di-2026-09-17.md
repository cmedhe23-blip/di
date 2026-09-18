# Cosmic Birthday Journey for Di

## Experience
- Build one immersive, full-screen story with 12 cinematic scenes matching the supplied pastel cosmic reference.
- Keep “Di” as the celebrated name everywhere, with a centralized configuration for names, dates, messages, photos, wishes, audio, colors, balloons, and candles.
- Add a persistent scene counter, previous/next controls, keyboard arrows, wheel navigation, and touch swipes.

## Scenes and interactions
1. Welcome garden with drifting clouds, flowers, stars, particle burst, and Enter transition.
2. Floating celestial treasure chest with parallax, glowing lock, opening sequence, and Unseal interaction.
3. Vintage cosmic video portal with a real full-screen player and graceful empty-video state.
4–5. Floating Polaroid gallery with pointer parallax, swipe/arrows/keyboard, plus a glass memory detail viewer.
6. Animated parchment birthday letter surrounded by flowers and falling petals.
7. Interactive balloon world with 15 pop targets, score, messages, confetti, and completion celebration.
8. Layered wishing cake with six clickable candles, unique wishes, smoke, and completion fireworks.
9. Canvas fireworks over a moonlit ocean, with automatic and click-launched bursts.
10. Animated galaxy portal that expands to reveal the final secret.
11. Luxury cream and gold heartfelt letter with editable long-form message.
12. Cosmic closing scene with replay, memories, and celebration controls.

## Visual and sound system
- Use lavender, blush, periwinkle, midnight purple, teal, cream, and gold semantic color tokens.
- Use Great Vibes, Playfair Display, and Poppins through document font links.
- Create original generated scene artwork for the celestial chest, video portal, floral parchment, cake, and cosmic backgrounds; use replaceable sample photographs for memories.
- Use restrained layered CSS motion and Canvas particles, reducing density and motion on smaller screens and for reduced-motion preferences.
- Add a global music control with volume and remembered preference, activated only after user interaction; sound hooks remain easy to replace.

## Structure and validation
- Split scene UI, visual effects, controls, and editable content into focused React/TypeScript modules.
- Use the existing TanStack/Vite/Tailwind setup, install Motion for React, and use existing button components for controls.
- Add app-specific page metadata.
- Verify desktop and mobile layouts, scene navigation, gallery, video modal, balloons, candles, fireworks, portal reveal, replay, and browser console health.
