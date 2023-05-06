import { LoginPage } from "cypress/page-objects/Login.po";
import { RegisterPage } from "cypress/page-objects/Register.po";
import { TripsPage } from "cypress/page-objects/Trips.po";
import { generateString } from "../functions";

describe('add an explorer actor and login', () => {

    const registerPage = new RegisterPage;
    const loginPage = new LoginPage;
    const tripsPage = new TripsPage;

    let random_word = generateString(10);

    let role = "EXPLORER";
    let name = "Name "+random_word;
    let surname = "Surname "+random_word;
    let phone_number = "123456789";
    let address = "Address "+random_word;
    let email = "explorer"+random_word+"@elplan.es";
    let password = "1234567890";

    let actor_saved_message = registerPage.getActorSavedMessage(email);

    it('passes', () => {

        //go to register page
        registerPage.navigateToLoginPage();

        cy.url().should('eq', registerPage.register_url);

        //type actor's data
        registerPage.fillActorData(
            role, 
            name,
            surname,
            phone_number,
            address,
            email,
            password
        );

        //verify a couple of values of the register form
        cy.get(registerPage.actor_email_selector).should('have.value', email);
        cy.get(registerPage.actor_password_selector).should('have.value', password);

        //save trip and ensure saving was successfull
        registerPage.submitRegisterForm();

        cy.contains(actor_saved_message).should('be.visible');

        //login the actor
        loginPage.navigateToLoginPage();

        loginPage.submitLoginForm(email, password);

        //verify the page is trip's list
        cy.url().should('eq', tripsPage.trips_list_url);

        //verify the navbar is displaying logged actor's email
        cy.get(loginPage.user_dropdow_menu_selector).contains(email).should('be.visible');

        //logout the actor
        loginPage.logOut();

        cy.url().should('eq', loginPage.login_url);
    })
})