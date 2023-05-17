import { LoginPage } from "cypress/page-objects/Login.po";
import { TripsPage } from "cypress/page-objects/Trips.po";
import { generateString } from "../functions";

describe('add and edit trip', () => {

  const loginPage = new LoginPage;
  const tripsPage = new TripsPage;

  let random_word = generateString(10);

  //trip original data
  let title = "title "+random_word;
  let description = "original description";
  let price = 350;
  let requirement = "certain requirement "+random_word;

  let start_date = (new Date()).toJSON().slice(0,10); 
  let end_date = (new Date()).toJSON().slice(0,10); 
  let stage_title = "stage title "+random_word;
  let stage_description = "stage description "+random_word;

  it('passes', () => {

    //trip modified data
    let modified_description = "modified description";

    //login the actor
    loginPage.navigateToLoginPage();

    cy.fixture("login-credentials").then((data) => {

      loginPage.submitLoginForm(data.email, data.password);

      //verify the page is trip's list
      cy.url().should('eq', tripsPage.trips_list_url);
      
      //go to create trip page
      tripsPage.goToCreateTripPage();

      cy.url().should('eq', tripsPage.add_trips_url);

      //type trip's data
      tripsPage.fillTripData(
        title, 
        description, 
        price, 
        requirement, 
        start_date,
        end_date,
        stage_title,
        stage_description
      );

      //save trip and ensure saving was successfull
      tripsPage.submitTripForm();
  
      cy.contains(tripsPage.trip_saved_message).should('be.visible');
  
      //search for the trip by keyword
      tripsPage.goToTripList();

      cy.url().should('eq', tripsPage.trips_list_url);

      tripsPage.searByKeyWord(random_word);
      
      //edit the trip and ensure saving was successfull
      tripsPage.goToEditTrip(title);

      tripsPage.editTrip(modified_description);

      cy.contains(tripsPage.trip_saved_message).should('be.visible');
      
      //search for the trip by keyword
      tripsPage.goToTripList();

      cy.url().should('eq', tripsPage.trips_list_url);

      tripsPage.searByKeyWord(random_word);
  
      //ensure the description has been modified
      cy.get(tripsPage.trip_card_selector)
      .contains(title)
      .get(tripsPage.description_card_text_selector)
      .contains(modified_description)
      .should('be.visible');

      //logout the actor
      loginPage.logOut();

      cy.url().should('eq', loginPage.login_url);

    });

  })
})