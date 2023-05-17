export class RegisterPage
{
    register_url = 'http://localhost:4200/register';

    actor_role_selector = '#role';
    actor_name_selector = '#name';
    actor_surname_selector = '#surname';
    actor_phone_number_selector = '#phone_number';
    actor_address_selector = '#address';
    actor_email_selector = '#email';
    actor_password_selector = '#password';

    register_actor_submit_selector = '#register-actor-submit';



    navigateToLoginPage()
    {
        cy.visit(this.register_url);
    }

    fillActorData(
        role, 
        name,
        surname,
        phone_number,
        address,
        email,
        password
    )
    {
        cy.get(this.actor_role_selector).select(role);
        cy.get(this.actor_name_selector).clear().type(name);
        cy.get(this.actor_surname_selector).clear().type(surname);
        cy.get(this.actor_phone_number_selector).clear().type(phone_number);
        cy.get(this.actor_address_selector).clear().type(address);
        cy.get(this.actor_email_selector).clear().type(email);
        cy.get(this.actor_password_selector).clear().type(password);
    }

    submitRegisterForm()
    {
        cy.get(this.register_actor_submit_selector).click();
    }

    getActorSavedMessage(email)
    {
        return "User with email '"+email+"' registered successfully";
    }
}