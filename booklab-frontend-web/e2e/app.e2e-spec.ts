import { AppPage } from './app.po';

describe('book-lab App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getHeader()).toBeTruthy();
  });

  it('should start with home page component', () => {
      page.navigateTo();
      expect(page.getCurrentRoutedComponent('app-home').isPresent()).toBeTruthy();
  });
  
});
