# OpenCode AI Skills

Настройка OpenCode Desktop: 38 навыков, 39 слэш-команд и скрытые агенты, чтобы английские инструкции не появлялись в чате.

## Установка

Глобально:

```powershell
.\install.ps1
```

В текущий проект:

```powershell
.\install.ps1 -Scope project
```

`install.sh` для macOS/Linux:

```bash
chmod +x install.sh
./install.sh user
```

Установщик копирует:

- навыки в `~/.config/opencode/skills/`;
- команды в `~/.config/opencode/commands/`;
- скрытых агентов в `~/.config/opencode/agents/`.

## Как скрываются инструкции

Каждая команда в `.opencode/commands/` содержит только `$ARGUMENTS`. Английские инструкции лежат в системном промпте скрытого агента `.opencode/agents/cmd-<command>.md`.

В чате видно только твой текст. Агент сам загружает нужный навык и следует ему.

## Команды

`/prompt`, `/plan`, `/spec`, `/tasks`, `/grill-me`, `/brainstorm`, `/orchestrate`, `/review`, `/debug`, `/test`, `/verify`, `/commit`, `/api`, `/refactor`, `/docs`, `/research`, `/learn`, `/notes`, `/lab`, `/coursework`, `/gost`, `/originality`, `/write`, `/humanize`, `/edit-ru`, `/translate`, `/ru-quality`, `/meeting`, `/slides`, `/project`, `/career`, `/data`, `/sql`, `/prd`, `/prioritize`, `/ui`, `/a11y`, `/skill`, `/handoff`.

`/grill-me` задаёт вопросы по одному через интерактивное окно OpenCode, с вариантами и рекомендованным ответом. После ответа сам задаёт следующий вопрос.

## Структура

```text
.opencode/commands/     # команды, только $ARGUMENTS
.opencode/agents/       # скрытые агенты с инструкциями
skills/                 # универсальные Agent Skills
prompts/                # standalone-промпты
docs/                   # каталог и источники
```

## Универсальный репозиторий

Только `SKILL.md` без OpenCode-обвязки:

**https://github.com/hydroimperium/ai-skills**

## Проверка

```bash
npm run validate
```

## Права и источники

© 2026 hydroimperium. Все права защищены. Лицензия не предоставляется. Сторонние идеи и их лицензии перечислены в [`docs/SOURCES.md`](docs/SOURCES.md) и [`NOTICE.md`](NOTICE.md).
