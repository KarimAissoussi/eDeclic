Feature: Génération ISIN et vérification fichier CSV sur MinIO

  Scenario: Appel API ISIN puis vérification du fichier CSV généré sur MinIO
    Given j'appelle l'API ISIN avec le flux JSON
    Then le code retour est 202
    When je me connecte sur MinIO
    And je navigue vers le bucket "quantalys" dossier "IN"
    Then un fichier CSV du jour existe avec une heure proche de l'exécution
