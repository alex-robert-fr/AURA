# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.1] - 2026-04-30

### Added

- Affiche une simulation 3D isométrique en plein écran avec un terrain plat et un monument central placeholder, sur fond sombre adapté à l'ère courante (`genesis`, `industria` ou `singularity`)
- Caméra orbitale contrôlable à la souris avec zoom limité entre 8 et 80 unités et limites angulaires empêchant de passer sous le terrain ou de se retourner verticalement
- Met en pause automatiquement le rendu 3D quand l'onglet n'est pas visible, pour limiter la consommation CPU/GPU lors des longues sessions sur écran secondaire
- Adapte la couleur de fond de la scène à chaque transition d'ère, sans recharger la page
- Affiche un overlay UI minimaliste avec le titre `Aura · Architecte Alex` en haut à gauche
- Expose un endpoint `GET /health` côté API qui renvoie le statut du serveur, l'état de connexion à la base de données et un timestamp ISO

[Unreleased]: https://github.com/alex-robert-fr/AURA/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/alex-robert-fr/AURA/releases/tag/v0.0.1
