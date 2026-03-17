function fn() {
  var config = {
    baseUrl: 'https://declic-oav-sgom-k8s.rci.harvest.fr',
    catalogSyncUrl: 'https://declic-catalog-sync-k8s.dev.harvest.fr',
    // URL du microservice de mise à jour des caractéristiques (à configurer)
    characteristicsUrl: 'https://declic-oav-sgom-k8s.rci.harvest.fr'
  };

  // Environnement (dev, recette, prod)
  var env = karate.env;
  if (env == 'recette') {
    config.baseUrl = 'https://declic-oav-sgom-recette.rci.harvest.fr';
    config.catalogSyncUrl = 'https://declic-catalog-sync-recette.harvest.fr';
    config.characteristicsUrl = 'https://declic-oav-sgom-recette.rci.harvest.fr';
  }

  karate.configure('connectTimeout', 30000);
  karate.configure('readTimeout', 30000);

  return config;
}
