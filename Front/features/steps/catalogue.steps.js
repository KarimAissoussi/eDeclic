const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { LoginPage } = require('../../pages/LoginPage');
const { CataloguePage } = require('../../pages/CataloguePage');

const { Given, When, Then } = createBdd();

Given('je suis sur la page de connexion edeclic', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('je saisis mon email', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillUsername(/** @type {string} */ (process.env.EDECLIC_EMAIL));
});

When('je saisis mon mot de passe', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.fillPassword(/** @type {string} */ (process.env.EDECLIC_PASSWORD));
});

When('je clique sur le bouton de connexion', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.submit();
});

Then('je suis redirigé vers le catalogue', async ({ page }) => {
  const cataloguePage = new CataloguePage(page);
  await cataloguePage.waitForCatalogue();
  await expect(page).toHaveURL(/\/app\/exploitation\/catalogue/);
});

When("je clique sur l'onglet {string}", async ({ page }, tabName) => {
  const cataloguePage = new CataloguePage(page);
  await cataloguePage.clickTab(tabName);
});

Then("la dernière ligne de l'historique contient la note {string} à la date {string}", async ({ page }, expectedNote, expectedDate) => {
  const cataloguePage = new CataloguePage(page);
  const values = await cataloguePage.getHistoriqueFirstRowValues();

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║        HISTORIQUE - Première ligne           ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Date        : ${values['Date d\'intégration']}`);
  console.log(`║  Version     : ${values['Version']}`);
  console.log(`║  Note        : ${values['Note']}`);
  console.log(`║  Utilisateur : ${values['Utilisateur']}`);
  console.log('╚══════════════════════════════════════════════╝\n');

  const contenu = values['Contenu'];
  expect(contenu).toContain(expectedDate);
  expect(contenu).toContain(expectedNote);
});
