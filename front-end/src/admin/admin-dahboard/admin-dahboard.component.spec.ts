import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDahboardComponent } from './admin-dahboard.component';

describe('AdminDahboardComponent', () => {
  let component: AdminDahboardComponent;
  let fixture: ComponentFixture<AdminDahboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDahboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDahboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
