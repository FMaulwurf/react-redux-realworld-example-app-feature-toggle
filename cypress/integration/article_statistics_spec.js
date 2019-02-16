import { loadavg } from "os";

describe('Article Statistics', () => {
  beforeEach(() => {
    cy.server();
  })

  it('Should success loading shares', () => {
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon/, 'fixture:article.json').as('loadArticle');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/shares/, 'fixture:shares.json').as('loadShares');

    cy.visit('/article/how-to-train-your-dragon/statistics', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.wait(['@loadArticle', '@loadShares']);
    cy.get('.dot').its('length').should('be', 7);
  });

  afterEach(() => {
    cy.screenshot();
    cy.reload();
  });
});