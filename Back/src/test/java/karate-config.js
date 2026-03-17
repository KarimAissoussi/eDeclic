function fn() {
  var config = {
    baseUrl: 'https://declic-oav-sgom-k8s.rci.harvest.fr'
  };

  // Environnement (dev, recette, prod)
  var env = karate.env;
  if (env == 'recette') {
    config.baseUrl = 'https://declic-oav-sgom-recette.rci.harvest.fr';
  }

  karate.configure('connectTimeout', 30000);
  karate.configure('readTimeout', 30000);

  return config;
}
