import { A2cliPage } from './app.po';

describe('a2cli App', function() {
  let page: A2cliPage;

  beforeEach(() => {
    page = new A2cliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
