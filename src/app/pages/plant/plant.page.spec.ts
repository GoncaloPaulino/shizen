import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlantPage } from './plant.page';

describe('PlantPage', () => {
  let component: PlantPage;
  let fixture: ComponentFixture<PlantPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
