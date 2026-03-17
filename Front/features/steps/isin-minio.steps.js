const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { MinioPage } = require('../../pages/MinioPage');
const fs = require('fs');

const { Given, When, Then } = createBdd();

let apiResponseStatus;
let apiCallTime;
let downloadedFilePath;
let sentIsinCodes = [];

let lastPayload;

Given("j'appelle l'API ISIN avec les codes suivants", async ({ request }, dataTable) => {
  sentIsinCodes = dataTable.rows().map((row) => row[0]);
  lastPayload = {
    application: { code: 'DECLIC-OAV', name: 'Declic OAV', perso: 'SGOM' },
    characteristics: [{ code: 'SRI' }],
    products: sentIsinCodes.map((code) => ({ code })),
  };
  apiCallTime = new Date();
  const response = await request.post(process.env.ISIN_API_URL, {
    data: lastPayload,
    headers: { 'Content-Type': 'application/json' },
  });
  apiResponseStatus = response.status();
  console.log(`\n[API ISIN] POST ${process.env.ISIN_API_URL}`);
  console.log(`[API ISIN] Codes envoyés: ${sentIsinCodes.join(', ')}`);
  console.log(`[API ISIN] Nombre: ${sentIsinCodes.length}`);
  console.log(`[API ISIN] Status: ${apiResponseStatus}`);
  console.log(`[API ISIN] Heure: ${apiCallTime.toLocaleTimeString('fr-FR')}`);
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

When('je clique sur le fichier CSV du jour', async ({ page }) => {
  const minioPage = new MinioPage(page);
  await minioPage.clickOnCsvFile('isin_data_');
});

When('je télécharge le fichier', async ({ page }) => {
  const minioPage = new MinioPage(page);
  const { filePath, suggestedName } = await minioPage.downloadFile();
  downloadedFilePath = filePath;
  console.log(`[Download] Fichier: ${suggestedName}`);
});

Then('le fichier CSV contient exactement les codes ISIN envoyés', async ({}) => {
  expect(downloadedFilePath, "Le fichier n'a pas été téléchargé").toBeTruthy();
  const csvContent = fs.readFileSync(downloadedFilePath, 'utf-8');
  const csvLines = csvContent.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const csvIsins = csvLines.slice(1);
  console.log(`\n[CSV] Contenu:\n${csvContent}`);
  console.log(`[CSV] ISIN dans CSV: ${csvIsins.join(', ')}`);
  console.log(`[CSV] ISIN envoyés: ${sentIsinCodes.join(', ')}`);

  let hasError = false;
  for (const isin of sentIsinCodes) {
    const found = csvIsins.includes(isin);
    console.log(`[CSV] ${isin} -> ${found ? 'OK' : 'ABSENT'}`);
    if (!found) hasError = true;
  }
  if (csvIsins.length !== sentIsinCodes.length) hasError = true;

  if (hasError) {
    const curlBody = JSON.stringify(lastPayload, null, 2);
    console.log(`\n[KO] Pour reproduire manuellement :`);
    console.log(`curl -X POST ${process.env.ISIN_API_URL} \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '${curlBody}'`);
  }

  for (const isin of sentIsinCodes) {
    expect(csvIsins, `ISIN ${isin} absent du CSV`).toContain(isin);
  }
  console.log(`[CSV] Nombre envoyés: ${sentIsinCodes.length}, dans CSV: ${csvIsins.length}`);
  expect(csvIsins.length).toBe(sentIsinCodes.length);
  console.log(`[CSV] ✓ CSV correspond aux ${sentIsinCodes.length} codes ISIN envoyés`);
});

Then('le fichier CSV ne contient aucun des codes ISIN envoyés', async ({}) => {
  expect(downloadedFilePath, "Le fichier n'a pas été téléchargé").toBeTruthy();
  const csvContent = fs.readFileSync(downloadedFilePath, 'utf-8');
  const csvLines = csvContent.trim().split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const csvIsins = csvLines.slice(1);
  console.log(`\n[CSV] Contenu:\n${csvContent}`);
  console.log(`[CSV] ISIN dans CSV: ${csvIsins.join(', ')}`);
  console.log(`[CSV] ISIN envoyés (invalides): ${sentIsinCodes.join(', ')}`);
  for (const isin of sentIsinCodes) {
    const found = csvIsins.includes(isin);
    console.log(`[CSV] ${isin} -> ${found ? 'PRESENT (inattendu)' : 'ABSENT (attendu)'}`);
    expect(csvIsins).not.toContain(isin);
  }
  console.log(`[CSV] ✓ Aucun ISIN invalide dans le CSV`);
});

Then('le fichier CSV contient le code ISIN {string}', async ({}, isin) => {
  expect(downloadedFilePath, "Le fichier n'a pas été téléchargé").toBeTruthy();
  const csvContent = fs.readFileSync(downloadedFilePath, 'utf-8');
  console.log(`[CSV] Présence ${isin} -> ${csvContent.includes(isin) ? 'OK' : 'ABSENT'}`);
  expect(csvContent).toContain(isin);
});

Then('le fichier CSV ne contient pas le code ISIN {string}', async ({}, isin) => {
  expect(downloadedFilePath, "Le fichier n'a pas été téléchargé").toBeTruthy();
  const csvContent = fs.readFileSync(downloadedFilePath, 'utf-8');
  console.log(`[CSV] Absence ${isin} -> ${csvContent.includes(isin) ? 'PRESENT (KO)' : 'ABSENT (OK)'}`);
  expect(csvContent).not.toContain(isin);
});
