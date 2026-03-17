Feature: Health check microservice

  Scenario: Check service health
    Given url 'https://declic-catalog-sync-k8s.dev.harvest.fr/management/health'
    When method GET
    Then status 200
    And match response.status == 'UP'
