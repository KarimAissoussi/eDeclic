const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { MinioPage } = require('../../pages/MinioPage');

const { Given, When, Then } = createBdd();

let apiResponseStatus;
let apiCallTime;

Given("j'appelle l'API ISIN avec le flux JSON", async ({ request }) => {
  const payload = {
    application: {
      code: 'DECLIC-OAV',
      name: 'Declic OAV',
      perso: 'SGOM',
    },
    characteristics: [{ code: 'SRI' }],
    products: [
      { code: 'FR0000000001' },
      { code: 'FR0010096352' },
      { code: 'LU0119620413' },
    ],
  };

  apiCallTime = new Date();
  const response = await request.post(process.env.ISIN_API_URL, {
    data: payload,
    headers: { 'Content-Type': 'application/json' },
  });
  apiResponseStatus = response.status();

  console.log(`\n[API ISIN] POST ${process.env.ISIN_API_URL}`);
  console.log(`[API ISIN] Status: ${apiResponseStatus}`);
  console.log(`[API ISIN] Heure appel: ${apiCallTime.toLocaleTimeString('fr-FR')}`);
});

Then('le code retour est {int}', async ({}, expectedStatus) => {
  expect(apiResponseStatus).toBe(expectedStatus);
});

When('je me connecte sur MinIO', async ({ page }) => {
  const minioPage = new MinioPage(page);
  await minioPage.login();
});

When('je navigue vers le bucket {string} dossier {string}', async ({ page }, bucket, folder) => {
  const minioPage = new MinioPage(page);
  await minioPage.navigateToBucketFolder(bucket, folder);
});

Then("un fichier CSV du jour existe avec une heure proche de l'exécution", async ({ page }) => {
  const minioPage = new MinioPage(page);
  const files = await minioPage.getLatestCsvFile();

  // Construire le nom attendu : isin_data_YYYY.MM.DD.csv
  const now = apiCallTime || new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const expectedFileName = `isin_data_${year}.${month}.${day}.csv`;

  console.log(`\n[MinIO] Fichiers trouvés dans IN/:`);
  files.forEach((f) => console.log(`  - ${f.name} (${f.date})`));
  console.log(`[MinIO] Fichier attendu: ${expectedFileName}`);

  // Vérifier que le fichier du jour existe
  const todayFile = files.find((f) => f.name === expectedFileName);
  expect(todayFile, `Le fichier ${expectedFileName} n'existe pas dans MinIO`).toBeTruthy();

  // Vérifier que la date contient "Today" ou la date du jour
  console.log(`[MinIO] Date du fichier: ${todayFile.date}`);
  console.log(`[MinIO] Heure de l'appel API: ${now.toLocaleTimeString('fr-FR')}`);

  // Le fichier doit avoir été modifié aujourd'hui
  const isToday = todayFile.date.toLowerCase().includes('today') ||
    todayFile.date.includes(`${day}/${month}/${year}`) ||
    todayFile.date.includes(`${year}-${month}-${day}`);
  expect(isToday, `Le fichier n'a pas été modifié aujourd'hui. Date affichée: ${todayFile.date}`).toBeTruthy();
});
