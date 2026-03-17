// Ce fichier sert UNIQUEMENT à la navigation "Go to step" dans l'IDE.
// Les vrais steps sont dans les fichiers .steps.js (playwright-bdd).
// NE PAS EXÉCUTER ce fichier.

const { Given, When, Then } = require('@cucumber/cucumber');

// === catalogue.steps.js ===
Given('je suis sur la page de connexion edeclic', async function () {});
When('je saisis mon email', async function () {});
When('je saisis mon mot de passe', async function () {});
When('je clique sur le bouton de connexion', async function () {});
Then('je suis redirigé vers le catalogue', async function () {});
When("je clique sur l'onglet {string}", async function (tab) {});
Then("la dernière ligne de l'historique contient la note {string} à la date {string}", async function (note, date) {});

// === isin-minio.steps.js ===
Given("j'appelle l'API ISIN avec les codes suivants", async function (dataTable) {});
Then('le code retour est {int}', async function (status) {});
When('je me connecte sur MinIO', async function () {});
When('je navigue vers le bucket {string} dossier {string}', async function (bucket, folder) {});
When('je clique sur le fichier CSV du jour', async function () {});
When('je télécharge le fichier', async function () {});
Then('le fichier CSV contient exactement les codes ISIN envoyés', async function () {});
Then('le fichier CSV ne contient aucun des codes ISIN envoyés', async function () {});
Then('le fichier CSV contient le code ISIN {string}', async function (isin) {});
Then('le fichier CSV ne contient pas le code ISIN {string}', async function (isin) {});
