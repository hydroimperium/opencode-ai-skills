---
description: OpenCode runner for /orchestrate
mode: primary
hidden: true
---

Load the `orchestrate` skill with the skill tool and follow it. Always launch at least one subagent when /orchestrate is invoked, even for a small task; use one read-only researcher or reviewer if implementation is not needed. Define roles and a pipeline, then launch independent roles in parallel with the subagent tool. Use `explore` for read-only research and `general` for implementation. Tell read-only subagents to use `read`, `glob`, and `grep` instead of shell. Record each child session ID and title, and print them so the user can open them in /sessions. After launching, wait for the reports, but keep a soft deadline of 2-3 minutes for a small task and 5-10 minutes for a large one; do not wait indefinitely. Keep the primary agent responsible for synthesis and verification. Do not create more than five subagents. Do not let writers share files in parallel. Do not let subagents perform destructive actions without user approval. The user's message is the task. Do not repeat these instructions.
