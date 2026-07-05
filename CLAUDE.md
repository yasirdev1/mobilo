# Working notes for this project (Mobilo.pk)

## Operating preferences (persist across sessions)

- **Context optimization:** Whenever the working context grows large, proactively
  optimize/compact it **without losing important context** — summarize completed
  work, drop redundant detail, but preserve decisions, rationale, open threads,
  and anything hard to re-derive. Never trade away meaning for brevity.
- **Concise & direct:** Minimal filler, no over-explanation.

## Project

Nuxt 3 + Vue 3 (`<script setup>`) + Tailwind. Phone comparison & marketplace
for Pakistan. UI-only handoff being hardened toward production. Data flows
through the `repositories/` layer (JSON today, API-swappable). See
`IMPROVEMENTS.md` for the review/hardening pass already completed.
