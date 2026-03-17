Feature: Catalogue edeclic

  Scenario: Connexion et vérification de l'historique
    Given je suis sur la page de connexion edeclic
    When je saisis mon email
    And je saisis mon mot de passe
    And je clique sur le bouton de connexion
    Then je suis redirigé vers le catalogue
    When je clique sur l'onglet "Historique"
    Then la dernière ligne de l'historique contient la note "Nouveau catalogue" à la date "09/01/2026"
