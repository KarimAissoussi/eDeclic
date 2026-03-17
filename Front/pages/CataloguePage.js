class CataloguePage {
  constructor(page) {
    this.page = page;

    // Sélecteurs
    this.historiqueTable = page.locator('.hvs-table').filter({ hasText: "Date d'intégration" });
    this.catalogueUrlPattern = '**/app/exploitation/catalogue**';
  }

  async waitForCatalogue() {
    await this.page.waitForURL(this.catalogueUrlPattern, { timeout: 60000 });
  }

  async clickTab(tabName) {
    await this.page.getByRole('tab', { name: tabName }).click();
    await this.page.waitForTimeout(1000);
  }

  async getHistoriqueFirstRow() {
    await this.historiqueTable.waitFor({ state: 'visible', timeout: 30000 });
    const firstRowBody = this.historiqueTable.locator('hvs-tbody').first();
    return firstRowBody;
  }

  async getHistoriqueFirstRowValues() {
    const firstRow = await this.getHistoriqueFirstRow();
    const rowText = await firstRow.textContent();

    const dateMatch = rowText.match(/(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/);
    const versionMatch = rowText.match(/(\d+\.\d+\.\d+)/);

    // Extraire Note et Utilisateur entre les labels connus
    const noteMatch = rowText.match(/Note(.+?)Utilisateur/s);
    const userMatch = rowText.match(/Utilisateur(.+?)Téléchargement/s);

    return {
      'Date d\'intégration': dateMatch ? dateMatch[1] : '',
      'Version': versionMatch ? versionMatch[1] : '',
      'Note': noteMatch ? noteMatch[1].replace(/Note/g, '').trim() : '',
      'Utilisateur': userMatch ? userMatch[1].replace(/Utilisateur/g, '').trim() : '',
      'Contenu': rowText.trim(),
    };
  }
}

module.exports = { CataloguePage };
