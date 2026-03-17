Feature: Génération ISIN et vérification fichier CSV sur MinIO

  Scenario: Vérification avec 1 code ISIN
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN         |
      | FR0010096352 |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés

  Scenario: Vérification avec 2 codes ISIN
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN         |
      | FR0000000001 |
      | LU0119620413 |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés

  Scenario: Vérification avec 3 codes ISIN
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN         |
      | FR0010096352 |
      | FR0000000001 |
      | LU0119620413 |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés
