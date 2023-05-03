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
  it('passes', () => {

    //fixture
    let email = 'manager@elplan.es';
    let password = '1234567890';
    
    //page object
    let original_description = "original description";
    let modified_description = "modified description";
    let trip_saved_message = "Viaje guardado exitosamente";
    let login_url = 'http://localhost:4200/login';
    let trips_list_url = 'http://localhost:4200/trips/list';
    let add_trips_url = 'http://localhost:4200/trips/add';
    let email_selector = '#email';
    let password_selector = '#password';
    let login_form_selector = '#loginForm';
    let add_trip_selector = '#add-trip';
    let trip_title_selector = '#title';
    let trip_description_selector = '#description';
    let add_trip_submit_selector = '#add-trip-submit';
    let keyword_selector = '#keyWord';
    let search_selector = '#search-button';
    let trip_card_selector = '.card';
    let description_card_text_selector = '.card-text';
    let edit_trip_selector = '#edit-trip';
    let trip_details_selector = '[name=trip-details]';

    let random_word = generateString(10);
    let title = "title "+random_word;

    cy.visit(login_url);

    cy.get(email_selector).type(email);
    cy.get(password_selector).type(password);

    cy.get(login_form_selector).submit();

    cy.url().should('eq', trips_list_url);

    cy.get(add_trip_selector).click();

    cy.url().should('eq', add_trips_url);

    cy.get(trip_title_selector).clear().type(title);
    cy.get(trip_description_selector).clear().type(original_description);

    cy.get(add_trip_submit_selector).click();

    cy.contains(trip_saved_message).should('be.visible');

    cy.visit(trips_list_url);

    cy.get(keyword_selector).clear().type(random_word);

    cy.get(search_selector).click();

    cy.get(trip_card_selector).contains(title).get(trip_details_selector).click();
    
    cy.get(edit_trip_selector).first().click();

    cy.get(trip_description_selector).clear().type(modified_description);
    
    cy.get(add_trip_submit_selector).click();

    cy.contains(trip_saved_message).should('be.visible');
    
    cy.visit(trips_list_url);

    cy.get(keyword_selector).clear().type(random_word);

    cy.get(search_selector).click();

    cy.get(trip_card_selector).contains(title).get(description_card_text_selector)
    .contains(modified_description).should('be.visible');;

  })
})