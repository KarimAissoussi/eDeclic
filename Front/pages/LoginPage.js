class LoginPage {
  constructor(page) {
    this.page = page;

    // Sélecteurs
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('#kc-login');
  }

  async goto() {
    await this.page.goto(/** @type {string} */ (process.env.EDECLIC_URL), { waitUntil: 'domcontentloaded' });
  }

  async fillUsername(email) {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }
}

module.exports = { LoginPage };
