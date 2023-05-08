export class TripsPage
{
    trip_saved_message = "Viaje guardado exitosamente";
    trips_list_url = 'http://localhost:4200/trips/list';
    add_trips_url = 'http://localhost:4200/trips/add';

    add_trip_selector = '#add-trip';

    trip_title_selector = '#title';
    trip_description_selector = '#description';
    trip_requirement_selector = '.requirement';
    trip_start_date_selector = '#startDate';
    trip_end_date_selector = '#endDate';
    stage_price_selector = '.price';
    stage_title_selector = '.stage_title';
    stage_description_selector = '.stage_description';
    
    add_trip_submit_selector = '#add-trip-submit';
    keyword_selector = '#keyWord';
    search_selector = '#search-button';
    trip_card_selector = '.card';
    description_card_text_selector = '.card-text';
    edit_trip_selector = '#edit-trip';
    trip_details_selector = '[name=trip-details]';
    trip_card_title_selector = '.card-title';

    goToCreateTripPage()
    {
        cy.get(this.add_trip_selector).click();
    }

    fillTripData(
        title, 
        original_description, 
        price, 
        requirement, 
        start_date,
        end_date,
        stage_title,
        stage_description)
    {
        cy.get(this.trip_title_selector).clear().type(title);
        cy.get(this.trip_description_selector).clear().type(original_description);
        cy.get(this.trip_requirement_selector).clear().type(requirement);
        cy.get(this.trip_start_date_selector).clear().type(start_date);
        cy.get(this.trip_end_date_selector).clear().type(end_date);

        cy.get(this.stage_price_selector).clear().type(price);
        cy.get(this.stage_title_selector).clear().type(stage_title);
        cy.get(this.stage_description_selector).clear().type(stage_description);
    }

    submitTripForm()
    {
        cy.get(this.add_trip_submit_selector).click();
    }

    goToTripList()
    {
        cy.visit(this.trips_list_url);
    }

    searByKeyWord(random_word)
    {
        cy.get(this.keyword_selector).clear().type(random_word);
  
        cy.get(this.search_selector).click();
    }

    goToDisplayTrip(title)
    {
        cy.get(this.trip_card_selector).contains(title).get(this.trip_details_selector).click();
    }

    goToEditTrip(title)
    {
        cy.get(this.trip_card_selector).contains(title).get(this.trip_details_selector).click();
      
        cy.get(this.edit_trip_selector).first().click();
    }

    editTrip(modified_description)
    {
        cy.get(this.trip_description_selector).clear().type(modified_description);
      
        cy.get(this.add_trip_submit_selector).click();
    }
} 