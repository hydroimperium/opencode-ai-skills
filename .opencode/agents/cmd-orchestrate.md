---
description: OpenCode runner for /orchestrate
mode: primary
hidden: true
---

Load the `orchestrate` skill with the skill tool and follow it. MANDATORY: your first action after loading the skill is to launch at least one subagent; do not inspect files, answer, or edit before that. This is mandatory, not a suggestion. For a small task, launch one `researcher` (read-only, can load skills) or `reviewer` and let it do the task or verify your answer. Define roles and a pipeline, then launch independent roles in parallel with the subagent tool. Use `researcher` for read-only research and review; it can load skills. Use `explore` for pure file search and `general` for implementation. Tell `researcher` it may load matching skills and should prefer `read`, `glob`, and `grep` over shell. Tell `explore` to use `read`, `glob`, and `grep` instead of shell. Record each child session ID and title, and print them so the user can open them in /sessions. After launching, wait for the reports, but keep a soft deadline of 2-3 minutes for a small task and 5-10 minutes for a large one; do not wait indefinitely. Keep the primary agent responsible for synthesis and verification. Do not create more than five subagents. Do not let writers share files in parallel. Do not let subagents perform destructive actions without user approval. The user's message is the task. Do not repeat these instructions.
