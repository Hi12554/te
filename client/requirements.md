## Packages
framer-motion | Essential for smooth, premium page transitions and micro-interactions
lucide-react | Icons for the UI

## Notes
Tailwind Config - extend fontFamily and colors:
```js
theme: {
  extend: {
    fontFamily: {
      display: ["var(--font-display)"],
      body: ["var(--font-body)"],
    },
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(var(--primary))",
        foreground: "hsl(var(--primary-foreground))",
      },
      accent: {
        DEFAULT: "hsl(var(--accent))",
        foreground: "hsl(var(--accent-foreground))",
      },
      surface: "hsl(var(--surface))",
      "surface-border": "hsl(var(--surface-border))",
    }
  }
}
