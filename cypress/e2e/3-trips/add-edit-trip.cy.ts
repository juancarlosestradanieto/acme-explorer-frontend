import { LoginPage } from "cypress/page-objects/Login.po";
import { TripsPage } from "cypress/page-objects/Trips.po";

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}

describe('template spec', () => {

  const loginPage = new LoginPage;
  const tripsPage = new TripsPage;

  it('passes', () => {

    //fixture

    
    //page object
    let original_description = "original description";
    let modified_description = "modified description";


    let random_word = generateString(10);
    let title = "title "+random_word;

    loginPage.navigateToLoginPage();

    cy.fixture("login-credentials").then((data) => {

      loginPage.submitLoginForm(data);

      cy.url().should('eq', tripsPage.trips_list_url);
      
      tripsPage.goToCreateTripPage();

      cy.url().should('eq', tripsPage.add_trips_url);

      tripsPage.fillTripData(title, original_description);
  
      tripsPage.submitTripForm();
  
      cy.contains(tripsPage.trip_saved_message).should('be.visible');
  
      tripsPage.goToTripList();

      tripsPage.searByKeyWord(random_word);
      
      tripsPage.goToEditTrip(title);

      tripsPage.editTrip(modified_description);

      cy.contains(tripsPage.trip_saved_message).should('be.visible');
      
      tripsPage.goToTripList();

      tripsPage.searByKeyWord(random_word);
  
      cy.get(tripsPage.trip_card_selector)
      .contains(title)
      .get(tripsPage.description_card_text_selector)
      .contains(modified_description)
      .should('be.visible');

    });

  })
})