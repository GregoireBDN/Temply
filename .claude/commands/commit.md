---
description: Commit les modifications en cours en respectant les conventions du projet
---

Crée un commit git des modifications en cours.

Étapes :

1. Lance `git status` et `git diff` (staged + unstaged) pour comprendre les changements.
2. Stage les fichiers pertinents (`git add`). Si des modifications n'ont rien à voir entre elles, propose de les séparer en plusieurs commits.
3. Rédige un message de commit **en une seule ligne** au format Conventional Commits :
   `type(scope): description courte`
   - `type` ∈ `feat` | `fix` | `refacto`
   - `scope` = la zone touchée (ex: `api`, `web`, `ui`)
   - Inclure un numéro de ticket s'il est disponible (nom de branche ou contexte), sinon l'omettre — ne jamais l'inventer.
4. **N'ajoute JAMAIS** de trailer `Co-Authored-By: Claude` ni de footer « Generated with Claude Code ». Le message doit contenir uniquement la ligne de sujet.
5. Si la branche courante est `main`, crée d'abord une branche avant de commit.
6. Lance le commit, puis confirme le hash et le message.

Argument optionnel (`$ARGUMENTS`) : si fourni, l'utiliser comme indication sur le scope, le type ou le ticket.
