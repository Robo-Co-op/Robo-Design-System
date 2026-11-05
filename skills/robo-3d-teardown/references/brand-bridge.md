# Robo 3D brand and UI mapping

Use **web/application** themes from resolved `dist/tokens.json`, not the dark-only Robo Lab slide variants. Generate resolved tokens with `npm run tokens` from the repository root. The exporter does not invent or approximate colors.

```bash
node skills/robo-3d-teardown/scripts/export-theme.mjs --brand robo-lab --theme light --out /tmp/robo-lab-3d-theme.json
```

From an installed Skill directory outside the design-system checkout, pass `--tokens /path/to/Robo-Design-System/dist/tokens.json` explicitly.

| 3D role | Design System source | Use |
|---|---|---|
| `stage.background` | `surface` | Scene backdrop, not automatically slide background |
| `stage.floor` | `surface-sunken` | Ground/support surface |
| `stage.activePart` | `accent` | The selected or moving component; one meaningful accent |
| `stage.passivePart` | `border-strong` | Inactive equipment outline, not a physical material specification |
| `hud.panel` | `surface-raised` | Control panel background |
| `hud.text` | `text` | Body/readouts |
| `hud.muted` | `text-muted` | Secondary labels |
| `hud.border` | `border-strong` | Visible panel bounds |
| `hud.action` | `primary-strong` | Interactive controls |
| `hud.onAction` | `on-primary` | Text on action fill |
| `hud.focus` | `focus` | Keyboard focus ring |

Use Roboto for Latin UI labels and Noto Sans JP for Japanese. Match `tokens/core.json` typography and spacing; provide readable contrast at phone sizes and a real focus indicator. Brand color is **never** a substitute for mechanical truth.

Brand-specific emphasis:
- **Robo Co-op:** human-to-machine handoffs, shared control and legible sync states.
- **Robo Lab:** system modules and measured technical cues. For **light** use ice-blue/white surfaces and blue/cyan active signal; do not force the dark slide variant.
- **Co-op Lab:** modular collective ownership or workshop learning; resist gratuitous neon.
- **Robo University:** numbered learning steps and checkpoints, with clear reset/next controls.

Load JSON once at build time or inline its **values** into the generated standalone HTML. Do not require a remote token CDN for an offline deliverable. The external teardown runtime has its own HTML composition; theme mapping requires custom integration work and is not automatic on installation.
