import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrdenDetalleComponent } from './orden-detalle';

describe('OrdenDetalleComponent', () => {
  let component: OrdenDetalleComponent;
  let fixture: ComponentFixture<OrdenDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenDetalleComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '12345678'
              }
            }
          }
        }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdenDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
