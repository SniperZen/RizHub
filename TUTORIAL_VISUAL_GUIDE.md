# RizHub Tutorial System - Visual Guide

## Tutorial Overview

### Step-by-Step Visual Representation

```
╔════════════════════════════════════════════════════════════════════════════╗
║                          STEP 1: WELCOME MESSAGE                           ║
║                                                                            ║
║                                                                            ║
║                      ┌─────────────────────────────┐                       ║
║                      │  🎮 Welcome to RizHub!      │                       ║
║                      │                             │                       ║
║                      │  Get ready to explore       │                       ║
║                      │  "Noli Me Tangere" in an    │                       ║
║                      │  interactive and fun way!   │                       ║
║                      │  Let's take a quick tour    │                       ║
║                      │  of the main features.      │                       ║
║                      │                             │                       ║
║                      │  [← Prev] [Skip Tour] [Next]│                       ║
║                      │                             │                       ║
║                      │  ● ○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○  │                       ║
║                      │  Step 1 of 13               │                       ║
║                      └─────────────────────────────┘                       ║
║                                                                            ║
║  (Full page darkened except tooltip - user cannot interact with page)     ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Step 2-12: Feature Highlight Pattern

```
╔════════════════════════════════════════════════════════════════════════════╗
║  HEADER: [🔊 Audio Controls]                                              ║
║                                                                            ║
║  ╔═══════════════════════════════════════════════════════════════════════╗ ║
║  ║                      CHALLENGE AREA                                    ║ ║
║  ║                                                                       ║ ║
║  ║  Chapters (Kabanata):                                                ║ ║
║  ║                                                                       ║ ║
║  ║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               ║ ║
║  ║  │  Chapter 1   │  │  Chapter 2   │  │  Chapter 3   │               ║ ║
║  ║  │   ⭐⭐⭐      │  │   ⭐⭐       │  │   ⭐        │  ◄──┐ HIGHLIGHT║ ║
║  ║  │    [▶]       │  │    [▶]       │  │    [▶]       │    │ THIS     ║ ║
║  ║  └──────────────┘  └──────────────┘  └──────────────┘    │ AREA     ║ ║
║  │  ...more chapters...                                      │          ║ ║
║  ║                                                           │          ║ ║
║  ║  ════════════════════════════════════════════════════════╦═════════ ║ ║
║  ║                                                          ║          ║ ║
║  ║                      ┌────────────────────────┐          ║          ║ ║
║  ║                      │ 📖 Chapters (Kabanata) │          ║          ║ ║
║  ║                      │                        │ ◄────────╫──ARROW   ║ ║
║  ║                      │ Here are the chapters  │          ║ POINTER  ║ ║
║  ║                      │ from Noli Me Tangere.  │          ║          ║ ║
║  ║                      │ Each chapter contains  │          ║          ║ ║
║  ║                      │ videos, character info,│          ║          ║ ║
║  ║                      │ word challenges, and   │          ║          ║ ║
║  ║                      │ quizzes. Click on any  │          ║          ║ ║
║  ║                      │ chapter to start!      │          ║          ║ ║
║  ║                      │                        │          ║          ║ ║
║  ║                      │ [← Prev] [Skip] [Next] │          ║          ║ ║
║  ║                      │                        │          ║          ║ ║
║  ║                      │ ● ● ○ ○ ○ ○ ○ ○ ○ ○  │          ║          ║ ║
║  ║                      │ Step 3 of 13           │          ║          ║ ║
║  ║                      └────────────────────────┘          ║          ║ ║
║  ║                                                           ║          ║ ║
║  ║ (Semi-transparent dark overlay everywhere except         ║          ║ ║
║  ║  the highlighted chapter area and tooltip)               ║          ║ ║
║  ╚═══════════════════════════════════════════════════════════════════════╝ ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

## Interactive Elements

### Progress Dots
```
Current Step = 5

● ● ● ● ● ○ ○ ○ ○ ○ ○ ○ ○
↑ ↑ ↑ ↑ ↑
Completed steps (filled orange dots)
                    Remaining steps (empty gray dots)
```

Users can click any dot to jump to that step!

### Navigation Buttons

```
┌──────────┬─────────────┬──────────┐
│  ← Prev  │  Skip Tour  │ Next →   │
└──────────┴─────────────┴──────────┘

← Prev
  - DISABLED on Step 1 (grayed out)
  - Enabled on Steps 2-13

Skip Tour
  - Shows on "skippable" steps (most steps)
  - Hidden on mandatory steps
  - Click ends tutorial immediately

Next →
  - Changes to "Finish ✓" on final step
  - Advances to next step or completes tutorial
```

## Color & Visual Design

### Color Scheme
```
Overlay Background:     #000000 with 0.7 opacity (semi-transparent dark)
Highlight Border:       #FBBF24 (yellow-300) - 2px solid
Highlight Glow:         0 0 30px rgba(255, 193, 7, 0.8) - pulsing animation
Tooltip Background:     #FFFFFF (white)
Primary Button:         #F97316 (orange-500)
Secondary Button:       #E5E7EB (gray-200)
Disabled Button:        #D1D5DB (gray-300)
Text (Main):            #78350F (amber-900)
Text (Secondary):       #374151 (gray-700)
```

### Animations

```
Overlay Fade In:
  Duration: 300ms
  ├─ opacity: 0 → 0.7
  └─ Easing: ease-out

Highlight Glow Pulse:
  Duration: 2000ms (infinite loop)
  ├─ boxShadow: 0 0 10px → 0 0 30px → 0 0 10px
  └─ Creates breathing glow effect

Tooltip Pop In:
  Duration: 300ms
  ├─ opacity: 0 → 1
  ├─ scale: 0.8 → 1
  └─ Easing: ease-out

Arrow Appearance:
  Duration: 300ms
  └─ opacity: 0 → 1
```

## Responsive Behavior

### Desktop (1024px+)
```
┌──────────────────────────────────────────────────┐
│  Tooltip: 350px wide, positioned optimally       │
│  Highlight: Normal size with padding             │
│  Arrow: Visible and properly positioned          │
│  Font: Regular (16px base)                       │
└──────────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────────┐
│  Tooltip: Max-width 350px       │
│  Positioned to fit viewport     │
│  Font: Slightly smaller         │
│  Touch-friendly buttons         │
└────────────────────────────────┘
```

### Mobile (< 768px)
```
┌────────────────┐
│  Tooltip: ~90% │
│  of viewport   │
│  Centered      │
│  Large buttons │
│  Small font    │
└────────────────┘
```

## Tutorial Flow Diagram

```
                          ┌─────────────────┐
                          │   User Logs In  │
                          └────────┬────────┘
                                   │
                          ┌────────▼────────┐
                          │  Go to Challenge│
                          │      Page       │
                          └────────┬────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │ Check tutorial_completed?  │
                    └──────────┬─────────┬────────┘
                               │         │
                           FALSE│         │TRUE
                               │         │
                    ┌──────────▼┐     ┌──┴─────────────┐
                    │Show       │     │Normal page load│
                    │Tutorial   │     │No tutorial     │
                    │Overlay    │     └────────────────┘
                    └──────┬────┘
                           │
              ┌────────────┴────────────┐
              │    User Interaction    │
              └────┬────────────┬───────┘
                   │            │
             Clicks│            │Clicks Skip
          "Finish" │            │
                   │            │
        ┌──────────▼──┐    ┌────▼──────────┐
        │POST Tutorial│    │POST Tutorial   │
        │Complete     │    │Complete        │
        │Update DB    │    │Update DB       │
        └──────┬──────┘    └────┬───────────┘
               │                │
               └────────┬───────┘
                        │
            ┌───────────▼──────────┐
            │ Save:                │
            │ tutorial_completed=1 │
            │ tutorial_completed_at│
            └───────────┬──────────┘
                        │
            ┌───────────▼──────────┐
            │ Hide Tutorial        │
            │ Resume Normal UI     │
            │ Page Fully Interactive
            └──────────────────────┘
```

## Tutorial Steps Breakdown

| Step | Title | Target | Visual | Interaction |
|------|-------|--------|--------|-------------|
| 1 | 🎮 Welcome | Full Page | Centered Popup | Wait/Next |
| 2 | 📚 Dashboard | Container | Spotlight | Highlight area |
| 3 | 📖 Chapters | Kabanata List | Glow & Arrow | Show features |
| 4 | ⭐ Progress | Stars | Point to feature | Explain stars |
| 5 | 🎯 Start Learning | Play Button | **Clickable** | MUST interact |
| 6 | 🎬 Videos | Video Container | Highlight | Show video area |
| 7 | 👥 Characters | Character Area | Spotlight | Quiz preview |
| 8 | 📝 Word Game | Word Container | Glow | Quiz preview |
| 9 | ❓ Quiz | Quiz Area | Spotlight | Challenge info |
| 10 | 🔊 Audio | Controls | Arrow | Settings info |
| 11 | 🔔 Notifications | Bell Icon | Point | Check updates |
| 12 | ⚙️ Profile | Menu | Arrow | Account access |
| 13 | 🎉 Completion | Full Page | Centered | Success message |

## User Interactions During Tutorial

```
┌─────────────────────────────────────┐
│         TUTORIAL ACTIVE             │
│                                     │
│  What users CAN do:                │
│  ✓ Read tutorial text               │
│  ✓ Click Next/Previous              │
│  ✓ Click Skip Tour                  │
│  ✓ Click progress dots              │
│  ✓ Scroll (if needed)               │
│                                     │
│  What users CANNOT do:              │
│  ✗ Click outside tooltip            │
│  ✗ Interact with page elements      │
│  ✗ Click disabled areas             │
│  ✗ Use keyboard (except in future)  │
│                                     │
│  Why? Semi-transparent overlay      │
│  has pointer-events: auto blocking  │
│  interaction with page behind       │
└─────────────────────────────────────┘
```

## Step 5 Special Case: Mandatory Interaction

```
Step 5: Challenge Button
├─ User must CLICK the challenge button
├─ Cannot skip this step
├─ Arrow points directly to button
├─ Text: "Click the challenge button to continue"
├─ Button gets special styling
└─ Tutorial waits for click → auto advances

This ensures users understand HOW to access activities
```

## Tooltip Positioning Algorithm

```
┌─────────────────┐
│  ELEMENT        │  (Element to highlight)
│  ┌─────────┐    │
│  │ Button  │    │
│  └─────────┘    │
└─────────────────┘

Priority Positions (in order):
1. BOTTOM    ← Try to show tooltip below element
2. TOP       ← If no room below, show above
3. RIGHT     ← If no room top/bottom, show right
4. LEFT      ← If no room all sides, show left
5. CENTER    ← If nothing works, center on screen

Adjustment Logic:
If tooltip goes off-screen horizontally:
  └─ Shift left or right to fit viewport

If tooltip goes off-screen vertically:
  └─ Shift up or down to fit viewport

Padding: 20px from viewport edges
```

## Animation Timeline

```
0ms     300ms          2000ms         ∞
│───────┤              │              │
│ Fade  │ Hold/Pulse   │ Hold/Pulse   │
│ In    │ Tooltip      │ Glow         │
│       │ Position     │              │
▼       ▼              ▼              ▼
Overlay + Tooltip + Arrow + Glow Animation
```

---

## Accessibility Features

```
✓ High contrast: Orange on white text
✓ Large buttons: 44px minimum touch target
✓ Clear labels: Descriptive button text
✓ Arrow indicators: Visual guidance
✓ Progress dots: Know where you are
✓ Skip option: Can skip if not interested
✓ Text sizing: Responsive to device
```

---

**Note:** This is a visual guide only. For implementation details, see [TUTORIAL_SETUP_GUIDE.md](TUTORIAL_SETUP_GUIDE.md)
