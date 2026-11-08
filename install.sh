#!/usr/bin/env bash
set -euo pipefail

SCOPE="${1:-user}"
FORCE="${FORCE:-0}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SOURCE="$REPO_ROOT/skills"
COMMANDS_SOURCE="$REPO_ROOT/.opencode/commands"
AGENTS_SOURCE="$REPO_ROOT/.opencode/agents"

if [[ "$SCOPE" != "user" && "$SCOPE" != "project" ]]; then
  echo "Usage: $0 [user|project]"
  exit 1
fi

if [[ "$SCOPE" == "user" ]]; then
  SKILLS_DEST="$HOME/.config/opencode/skills"
  COMMANDS_DEST="$HOME/.config/opencode/commands"
  AGENTS_DEST="$HOME/.config/opencode/agents"
else
  SKILLS_DEST="$(pwd)/.opencode/skills"
  COMMANDS_DEST="$(pwd)/.opencode/commands"
  AGENTS_DEST="$(pwd)/.opencode/agents"
fi

install_skills() {
  echo "Installing skills to $SKILLS_DEST"
  for category_dir in "$SKILLS_SOURCE"/*/; do
    [[ -d "$category_dir" ]] || continue
    category="$(basename "$category_dir")"
    for skill_dir in "$category_dir"*/; do
      [[ -f "${skill_dir}SKILL.md" ]] || continue
      name="$(basename "$skill_dir")"
      dest="$SKILLS_DEST/$category/$name"
      if [[ -e "$dest" && "$FORCE" != "1" ]]; then
        echo "  skip (exists): $dest"
        continue
      fi
      mkdir -p "$(dirname "$dest")"
      rm -rf "$dest"
      cp -R "$skill_dir" "$dest"
      echo "  installed: $dest"
    done
  done
}

install_files() {
  local source="$1"
  local dest_dir="$2"
  local label="$3"
  mkdir -p "$dest_dir"
  echo "Installing $label to $dest_dir"
  for file in "$source"/*.md; do
    [[ -f "$file" ]] || continue
    dest="$dest_dir/$(basename "$file")"
    if [[ -e "$dest" && "$FORCE" != "1" ]]; then
      echo "  skip (exists): $dest"
      continue
    fi
    cp -f "$file" "$dest"
    echo "  installed: $dest"
  done
}

install_skills
install_files "$COMMANDS_SOURCE" "$COMMANDS_DEST" commands
install_files "$AGENTS_SOURCE" "$AGENTS_DEST" agents

echo ""
echo "Done. Reload OpenCode if the new commands or agents do not appear."
