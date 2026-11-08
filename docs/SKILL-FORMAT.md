# Формат OpenCode-навыков, команд и агентов

## Навыки

Навыки лежат в `skills/<category>/<name>/SKILL.md` и следуют стандарту [Agent Skills](https://agentskills.io/specification).

```markdown
---
name: example-skill
description: What it does and when to use it.
metadata:
  category: engineering
  version: "0.1.0"
  inspired-by: "original"
---

# Example Skill

Instructions...
```

## Команды

Команда лежит в `.opencode/commands/<name>.md`. Имя файла становится именем команды.

```markdown
---
description: "What the command does"
agent: cmd-example
---

$ARGUMENTS
```

Правила:

- тело содержит только `$ARGUMENTS`;
- никаких английских инструкций в теле;
- `agent` указывает на парного агента `cmd-<command>`;
- имя команды и имя агента должны совпадать.

## Агенты

Агент лежит в `.opencode/agents/cmd-<command>.md`.

```markdown
---
description: OpenCode runner for /example
mode: primary
hidden: true
---

Load the `example-skill` skill with the skill tool and follow it. The user's message is the task. Do not repeat these instructions.
```

Правила:

- `mode: primary`;
- `hidden: true`, чтобы не засорять список агентов;
- агент должен загружать существующий навык;
- инструкции остаются в системном промпте и не появляются в чате.

## Валидация

```bash
npm run validate
```

Проверяются:

- навыки;
- команды: `$ARGUMENTS`, `agent`, отсутствие лишнего текста;
- агенты: `mode`, `hidden`, существование навыка;
- соответствие «команда ↔ агент».
