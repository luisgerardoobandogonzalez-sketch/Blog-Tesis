import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageBlogsPage } from './manage-blogs.page';

describe('ManageBlogsPage', () => {
  let component: ManageBlogsPage;
  let fixture: ComponentFixture<ManageBlogsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBlogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
