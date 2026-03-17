Feature: Envoi des caractéristiques Quantalys vers Declic

  Background:
    * url characteristicsUrl

  Scenario: Poster le flux JSON des caractéristiques produits
    * def payload =
      """
      {
        "application": {
          "code": "DECLIC-OAV",
          "name": "Declic OAV",
          "perso": "SGOM"
        },
        "products": [
          {
            "code": "isin_1",
            "characteristics": {
              "SRRI": 2,
              "DIC": "https://domaine.com/doc2.pdf",
              "TAXONOMIE": 0.7,
              "SFDR": 0.5,
              "PAI_SECTEUR1": true,
              "PAI_SECTEUR2": false,
              "PAI_SECTEUR3": true,
              "PAI_SECTEUR4": true,
              "PAI_SECTEUR7": true,
              "PAI_SECTEUR8": true,
              "PAI_SECTEUR10": true
            }
          },
          {
            "code": "isin_2",
            "characteristics": {
              "SRRI": 7,
              "DIC": "https://domaine.com/doc7.pdf",
              "TAXONOMIE": 0.7,
              "SFDR": 0.5,
              "PAI_SECTEUR1": true,
              "PAI_SECTEUR2": false,
              "PAI_SECTEUR3": true,
              "PAI_SECTEUR4": false,
              "PAI_SECTEUR7": false,
              "PAI_SECTEUR8": true,
              "PAI_SECTEUR10": false
            }
          }
        ]
      }
      """
    Given path '/api/catalog/characteristics'
    And request payload
    When method POST
    Then status 200

    # Validations métier sur la structure du flux
    And match payload.application.perso != ''
    And match payload.application.code == 'DECLIC-OAV'
    And match each payload.products contains { code: '#string', characteristics: '#object' }
    And match payload.products[0].characteristics contains { SRRI: '#number', DIC: '#string', TAXONOMIE: '#number', SFDR: '#number' }
    And match payload.products[0].characteristics.SRRI == '#? _ >= 1 && _ <= 7'
