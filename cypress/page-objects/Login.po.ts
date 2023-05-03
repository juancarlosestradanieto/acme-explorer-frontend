export class LoginPage
{
    login_url = 'http://localhost:4200/login';
    navigateToLogin()
    {
        cy.visit(this.login_url);
    }
} 