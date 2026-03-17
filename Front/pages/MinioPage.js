class MinioPage {
  constructor(page) {
    this.page = page;
  }

  async login() {
    await this.page.goto(`${process.env.MINIO_URL}/login`, { waitUntil: 'domcontentloaded' });
    await this.page.locator('#accessKey').fill(process.env.MINIO_USERNAME);
    await this.page.locator('#secretKey').fill(process.env.MINIO_PASSWORD);
    await this.page.locator('span.button-label', { hasText: 'Login' }).click();
    await this.page.waitForURL('**/browser**', { timeout: 30000 });
  }

  async navigateToBucketFolder(bucket, folder) {
    // Essayer d'aller directement à l'URL du dossier
    await this.page.goto(`${process.env.MINIO_URL}/browser/${bucket}/${folder}/`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    // Attendre que le tableau se charge
    await this.page.locator('.ReactVirtualized__Table__row').first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async getLatestCsvFile() {
    // Récupérer toutes les lignes du tableau
    const rows = this.page.locator('.ReactVirtualized__Table__row');
    const count = await rows.count();

    const files = [];
    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const nameEl = row.locator('.fileNameText');
      const nameExists = await nameEl.count();
      if (nameExists === 0) continue;

      const name = await nameEl.textContent();
      if (!name.endsWith('.csv')) continue;

      // Récupérer la date affichée (colonne 3)
      const cols = row.locator('[role="gridcell"]');
      const dateText = await cols.nth(2).textContent();

      files.push({ name: name.trim(), date: dateText.trim() });
    }

    return files;
  }

  async clickOnCsvFile(fileNamePrefix) {
    // Cliquer sur le fichier CSV dont le nom commence par fileNamePrefix (ex: "isin_data_")
    const fileSpan = this.page.locator('.fileNameText').filter({ hasText: fileNamePrefix });
    await fileSpan.first().click();
    // Attendre que la page de détail/preview se charge
    await this.page.waitForTimeout(2000);
  }

  async downloadFile() {
    // Cliquer sur le bouton Download et capturer le fichier téléchargé
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 30000 }),
      this.page.locator('button', { hasText: 'Download' }).click(),
    ]);
    // Sauvegarder le fichier et retourner le chemin
    const filePath = await download.path();
    const suggestedName = download.suggestedFilename();
    console.log(`[MinIO] Fichier téléchargé: ${suggestedName}`);
    return { filePath, suggestedName };
  }
}

module.exports = { MinioPage };
