import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListaPacientesComponent } from './lista-pacientes';

describe('ListaPacientesComponent', () => {
  let component: ListaPacientesComponent;
  let fixture: ComponentFixture<ListaPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaPacientesComponent, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
