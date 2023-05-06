export class LoginPage
{
    login_url = 'http://localhost:4200/login';
    login_form_selector = '#loginForm';
    //email = 'manager@elplan.es';
    //password = '1234567890';
    email_selector = '#email';
    password_selector = '#password';

    user_dropdow_menu_selector = "#userDropdownMenuLink";
    logout_link_selector = "#logout-link";

    navigateToLoginPage()
    {
        cy.visit(this.login_url);
    }

    submitLoginForm(email, password)
    {
        cy.get(this.email_selector).type(email);
        cy.get(this.password_selector).type(password);
    
        cy.get(this.login_form_selector).submit();
    }

    logOut()
    {
        cy.get(this.user_dropdow_menu_selector).click();
        cy.get(this.logout_link_selector).click();
    }
} 