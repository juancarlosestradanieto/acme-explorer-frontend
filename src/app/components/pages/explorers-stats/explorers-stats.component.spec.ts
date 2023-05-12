import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorersStatsComponent } from './explorers-stats.component';

describe('ExplorerStatsComponent', () => {
  let component: ExplorersStatsComponent;
  let fixture: ComponentFixture<ExplorersStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplorersStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplorersStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
