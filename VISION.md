# CLAUDE.md — AURA

_Working title · v0.3 · Architecte : Alex_

Ce document est la vision d'AURA. Il sert de contexte de référence à toute personne (humaine ou Claude) qui contribue au projet. Il est volontairement orienté **vision** plutôt qu'**exécution** — les décisions techniques détaillées vivront dans les ADRs (`docs/DECISIONS.md`) au fur et à mesure qu'elles seront prises.

---

## 1. Le concept en 30 secondes

Aura est une **simulation 3D ambient** qui rend la vie visible _et_ projetable. Pas un outil de productivité. Pas une to-do list gamifiée. Un compagnon visuel persistant, posé sur un écran secondaire, où tout ce qui compte pour l'Architecte (présent, passé, futur) prend forme dans une cité-monde isométrique qu'il bâtit librement.

Tu es l'**Architecte**. Tu n'as pas de quêtes obligatoires, pas de boss à vaincre, pas de cartes à jouer. Tu **construis ta cité comme tu construis ta vie** — librement, à ton rythme, selon tes objectifs.

Catégorie : _idle ambient sandbox builder où la vie est l'input_.

---

## 2. Lore minimal

Le réseau s'appelle Aura. Chaque humain connecté possède sa propre cité-monde, projection vivante de sa réalité. Les Architectes ne se rencontrent pas — chaque cité est solitaire dans le cosmos.

Tu joues Alex, Architecte d'une cité unique qui te ressemble. Elle naît dans le biome Continental Tempéré, en page blanche.

Aucun NPC ennemi. Le seul antagoniste, c'est l'inactivité — la cité ne ment pas, et si tu fais rien, rien ne pousse.

---

## 3. Le rôle du joueur — l'Architecte

Tu es l'**Architecte** : celui qui dessine, bâtit, observe et fait grandir. Tu disposes d'un terrain vierge sur lequel tu décides de tout : où poser tes premiers bâtiments, comment organiser tes zones, quels districts faire émerger, quels projets matérialiser.

À la manière d'un **Cities Skylines** ou d'un **SimCity** : aucune zone n'est imposée. Tu crées des quartiers selon tes objectifs personnels — un district pour un projet créatif, un autre pour une relation que tu construis, un autre pour une compétence que tu travailles, un autre pour ton sport.

À la manière d'un **Empire Earth** : tes choix d'aujourd'hui dessinent ton parcours dans le temps. Les bâtiments d'hier restent visibles. La cité raconte ton histoire.

Le geste de l'Architecte est double :

**Geste de constatation** (rétro-action) :

> Faire quelque chose IRL → cliquer le bâtiment correspondant → micro-form de saisie → animation cinématique de construction → la cité persiste.

**Geste de planification** (pro-action) :

> Décider d'un objectif → poser le futur bâtiment dans la cité comme un _chantier_ → la grue et le scaffolding apparaissent → le bâtiment se complète au fur et à mesure des actions IRL réelles.

Le chantier est une promesse visible. Tant que tu n'as pas fait l'action, le bâtiment est un squelette. Quand tu agis, il prend forme. La cité te montre ce que tu as fait _et_ ce que tu t'es promis de faire.

---

## 4. Les 4 piliers du game design

### Pilier 1 — La cité (sandbox totale)

**Aucun district imposé.** La cité démarre vide.

L'Architecte crée librement :

- ses **zones** (équivalent du zonage Cities Skylines : tech, social, perso, ou ce qu'il veut)
- ses **districts** (regroupements thématiques : un projet, une saison de vie, un domaine d'apprentissage)
- ses **bâtiments** (instances uniques nommées : chaque maison, chaque atelier, chaque monument a un nom et une histoire)

Cinq types de bâtiments génériques sont disponibles comme **briques de base**, mais sans présupposé sur ce qu'ils représentent dans la vraie vie :

- **Monument** (vertical, dominant, pour les missions majeures)
- **Tour** (haute, fonctionnelle, pour les projets en cours)
- **Atelier** (cubique, productif, pour les sessions répétées)
- **Maison** (petite, identifiée, pour les personnes ou idées spécifiques)
- **Plateforme** (horizontale, ouverte, pour les espaces de relation/échange)

Chaque brique peut être customisée : couleur dominante (qui définit la sémantique de sa zone), enseigne lumineuse, étiquette nominative, hauteur.

**Règles d'or :**

- Tous les bâtiments sont **uniques et nommés**. Pas d'agrégation.
- Chaque bâtiment garde son **historique cliquable**.
- Les **chantiers** (bâtiments planifiés non encore complets) sont visibles dès leur pose, comme des promesses.
- L'Architecte peut **réorganiser** sa cité à tout moment (déplacer, renommer, supprimer un bâtiment ou une zone) — comme dans Cities Skylines.

### Pilier 2 — Actions IRL → événements ville

Le système nerveux d'Aura. Deux types d'inputs :

#### Sources automatiques (latence 1-30s)

Webhooks branchés sur les outils que l'Architecte utilise déjà. Selon ses besoins :

- Activité de création (déclencheurs configurables) → grue qui dépose un bloc
- Livraison majeure → +1 étage permanent
- Achèvement → onde de choc lumineuse
- Tâche résolue → buisson de mauvaise herbe disparaît

#### Sources manuelles (instantané, via micro-form)

Pour tout ce qui n'a pas de signal automatique :

- Conversation tenue → animation à la place publique
- Personne rencontrée → nouvelle Maison nominative
- Idée notée → livre ajouté à la Bibliothèque
- Accord / décision majeure → cérémonie de construction

#### Pose d'un chantier (planification)

- L'Architecte clique sur une zone vide → choisit un type de bâtiment → le nomme → fixe une intention
- Le chantier apparaît : grue + scaffolding statique
- Au fur et à mesure des actions liées (saisies manuellement ou détectées), le bâtiment se construit progressivement
- À la complétion, cinématique de finalisation

### Pilier 3 — La boucle quotidienne

**Aucun rituel matin obligatoire.** La cité est ouverte, l'Architecte l'observe quand il veut.

#### Pendant la journée

- La cité réagit en temps réel aux événements automatiques
- L'Architecte logge une action manuelle en cliquant le bâtiment correspondant (3 taps, 20 sec)
- L'Architecte peut **poser un nouveau chantier** à tout moment : c'est l'acte de planification
- **Présence permanente possible** : Aura tourne sur écran secondaire toute la journée comme un aquarium vivant

#### Le rituel du soir (volontaire)

1. L'Architecte clique le monument central → **Cérémonie du soir** déclenche
2. Cinématique : la cité passe en mode nuit, lumières allumées
3. Récap : animation de construction des nouveautés du jour, avancement des chantiers en cours
4. Champ texte libre **"Note du jour"** → manuscrit qui apparaît dans la Bibliothèque
5. Cinématique de clôture, monument seul illuminé en doré, fade out

### Pilier 4 — Progression long-terme

Trois directions imbriquées :

**A. Densité organique** — plus on vit, plus la cité pousse. Pas de niveaux discrets. La cité passe naturellement de _village_ à _métropole_ à _mégapole_ sur des mois.

**B. Ères** — quand certains seuils sont atteints, transition cinématique vers une nouvelle ère :

- **Genesis** (origine, < 100 actions) : cité clairsemée, palette pâle, lumière douce
- **Industria** (100-1000 actions) : cité dense moderne (par défaut au démarrage)
- **Singularity** (1000+ actions) : cité futuriste, cyberpunk, néons cyan/violet

**C. Biomes** — si l'Architecte vit une transformation profonde dans sa vie (nouveau chapitre, nouveau projet majeur), une _île secondaire_ émerge dans un autre biome (forêt, désert, glacier, océan). Les îles s'accumulent, connectées par des ponts.

---

## 5. Grammaire visuelle

### Effets par type d'événement

| Événement                      | Signature visuelle                                                      |
| ------------------------------ | ----------------------------------------------------------------------- |
| Pose d'un chantier (intention) | Apparition de grue + scaffolding statique + lumière clignotante orange  |
| Avancement d'un chantier       | Bloc qui s'ajoute, scaffolding qui descend                              |
| Construction terminée          | Cinématique d'inauguration, lumière dorée pulsante, l'enseigne s'allume |
| Recul / abandon                | Bâtiment éteint, fumée noire, possible démolition                       |
| Action de création             | Lumière bleue glacée                                                    |
| Action d'échange               | Lumière dorée                                                           |
| Action sociale                 | Lumière ambre                                                           |
| Action personnelle             | Lumière verte chaleureuse                                               |

### Règles

- **Taille de l'effet visuel = importance de l'événement.** Petite action = petit bloc. Grande victoire = monument qui s'illumine + feux d'artifice 10 sec.
- **Événements négatifs : constatables, jamais punitifs.** Une journée sans rien laisse la cité terne, pas honteuse.
- **Les chantiers sont visibles, pas honteux.** Un chantier qui n'avance pas pendant 30 jours commence à se végétaliser visuellement. Pas une punition — un signal honnête.
- **Ambient toujours vivant.** Piétons, voitures, fumée, cycle jour/nuit, lampadaires nocturnes.

---

## 6. Choix esthétique fondateur

Aura cherche à provoquer **bonheur** + **clarté**, dans cet ordre.

Le bonheur : voir la cité grandir et se densifier est une récompense en soi. La beauté visuelle est _le_ différenciateur.

La clarté : l'Architecte voit _ce qu'il a fait_ et _ce qu'il s'est promis de faire_, dans le même espace, sans jongler entre 3 outils. La cité est à la fois journal et plan.

Inspirations visuelles assumées :

- **Cities Skylines** (la chaleur de la cité vivante, le zonage libre)
- **SimCity** (la sandbox totale, le pouvoir de l'Architecte)
- **Empire Earth 1** (la richesse stratégique des âges, la persistance)
- **Star Citizen** (la maturité sci-fi premium)
- **visionOS / Apple Vision Pro** (l'épuration, le glassmorphism, la profondeur)

Inspirations rejetées :

- Cartoon / Clash Royale-like (trop enfantin)
- Gacha / pull-style (mécanique de pression rejetée)
- Cockpit dashboard avec stats (trop froid, pas un jeu)

---

## 7. Le double geste central

Tu n'as **aucun geste obligatoire** dans Aura. C'est sa singularité.

Mais les deux gestes _récompensés_ visuellement sont :

> **Constatation** : tu fais quelque chose IRL → tu cliques le bâtiment correspondant → micro-form de saisie 3 taps → animation cinématique de construction → la cité persiste.

> **Planification** : tu poses un chantier vide à un endroit de la cité → tu le nommes et fixes ton intention → la grue et le scaffolding apparaissent → le bâtiment se complète au fur et à mesure de tes actions IRL réelles.

Le premier dit _ce que j'ai fait_. Le second dit _ce que je veux faire devenir réel_. Ensemble, ils font de la cité une **carte vivante du présent et du futur**.

Si une feature future contredit l'un de ces deux gestes, c'est probablement la feature qui doit céder.
