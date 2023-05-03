export class LoginPage
{
    login_url = 'http://localhost:4200/login';
    login_form_selector = '#loginForm';
    //email = 'manager@elplan.es';
    //password = '1234567890';
    email_selector = '#email';
    password_selector = '#password';

    navigateToLoginPage()
    {
        cy.visit(this.login_url);
    }

    submitLoginForm(data: any)
    {
        cy.get(this.email_selector).type(data.email);
        cy.get(this.password_selector).type(data.password);
    
        cy.get(this.login_form_selector).submit();
    }
} 