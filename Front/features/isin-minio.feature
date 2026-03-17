Feature: Génération ISIN et vérification fichier CSV sur MinIO

  Scenario: Vérification avec 5 codes alphanumériques
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN         |
      | FR0010096352 |
      | LU0119620413 |
      | IE00B4L5Y983 |
      | DE0008430026 |
      | GB00B03MLX29 |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés

  Scenario: Vérification avec codes contenant des caractères spéciaux
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN           |
      | FR@010#096352  |
      | LU!0119$62041  |
      | IE00B4L5Y98&   |
      | DE000=843+026  |
      | GB%00B03MLX*9  |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés

  Scenario: Vérification avec 20 codes mélangés invalides
    Given j'appelle l'API ISIN avec les codes suivants
      | ISIN                     |
      | 1234567890               |
      | ABCDEFGHIJKL             |
      | FR                       |
      | 99                       |
      | XYZXYZXYZXYZXYZXYZ       |
      | 0000000000000000000      |
      | AB12                     |
      | FR0010096352FR0010096352 |
      | a                        |
      | 1A2B3C4D5E6F             |
      | ZZZZZZZZZZZZZ            |
      | 123ABC456DEF789          |
      | FR 0010 0963 52          |
      | !!@@##$$%%               |
      | abcdefghijkl             |
      | 9Z8Y7X6W5V4U             |
      | LONGCODEISINTROPLONG1234 |
      | 42                       |
      | A1B2C3                   |
      | 000AAA111BBB222          |
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    When je clique sur le fichier CSV du jour
    And je télécharge le fichier
    Then le fichier CSV contient exactement les codes ISIN envoyés
