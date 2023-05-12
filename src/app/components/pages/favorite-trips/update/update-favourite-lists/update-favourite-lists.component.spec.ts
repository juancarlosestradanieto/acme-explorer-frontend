import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFavouriteListsComponent } from './update-favourite-lists.component';

describe('UpdateFavouriteListsComponent', () => {
  let component: UpdateFavouriteListsComponent;
  let fixture: ComponentFixture<UpdateFavouriteListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFavouriteListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFavouriteListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
