Feature: Constitution de la liste ISIN pour le catalogue SGOM

  Background:
    * url baseUrl

  Scenario: Poster le flux JSON de la liste ISIN
    # Flux JSON attendu : application + caractéristiques + produits (ISIN)
    * def payload =
      """
      {
        "application": {
          "code": "DECLIC-OAV",
          "name": "Declic OAV",
          "perso": "SGOM"
        },
        "characteristics": [
          {"code": "SRI"},
          {"code": "DIC"},
          {"code": "ESG"}
        ],
        "products": [
          {"code": "isin_1"},
          {"code": "isin_2"},
          {"code": "isin_3"}
        ]
      }
      """
    Given path '/api/catalog/isin-list'
    And request payload
    When method POST
    Then status 200

    # Validations métier
    And match payload.application.perso != ''
    And match payload.application.code == 'DECLIC-OAV'
    And match each payload.characteristics contains { code: '#string' }
    And match each payload.products contains { code: '#string' }
    And match payload.characteristics == '#[3]'
