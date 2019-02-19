import { loadavg } from "os";

describe('Article Statistics', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/login', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
    const registeredUser = {
      username: 'jake',
      email: 'ja@ke.com',
      password: 'P4$$w0rd'
    };

    cy.route('POST', /.*\/api\/users/, {
      user: {
        id: Date.now(),
        email: registeredUser.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        username: registeredUser.username,
        bio: null,
        image: null,
        token: 'jwt'
      }
    }).as('postUser');

    cy.get('input[placeholder="Email"]').type(registeredUser.email);
    cy.get('input[placeholder="Password"]').type(`${registeredUser.password}{enter}`);

    cy.wait(['@postUser']);

  })

  it('Should success showing Statistics Button', () => {
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon/, 'fixture:article.json').as('loadArticle');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/comments/, 'fixture:comments.json').as('loadComments');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/shares/, 'fixture:shares.json').as('loadShares');
    cy.route(/.*\/api\/features/, 'fixture:features_article-statistics-feature_on.json').as('loadFeatures');
    cy.route(/.*\/api\/user/, 'fixture:user.json').as('loadUser');

    cy.visit('/article/how-to-train-your-dragon', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.wait(['@loadComments', '@loadArticle',  '@loadFeatures', '@loadUser']);
    
    cy.get('.btn-outline-secondary').contains('Statistics').should('exist');
    cy.get('.btn-outline-secondary').contains('Statistics').click();

    cy.wait(['@loadArticle', '@loadShares']);
    cy.get('.dot').its('length').should('be', 7);
    cy.get('.sharedots').should('exist')
  });

  it('Should fail showing Statistics Button', () => {
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon/, 'fixture:article.json').as('loadArticle');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/comments/, 'fixture:comments.json').as('loadComments');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/shares/, 'fixture:shares.json').as('loadShares');
    cy.route(/.*\/api\/features/, 'fixture:features_article-statistics-feature_off.json').as('loadFeatures');
    cy.route(/.*\/api\/user/, 'fixture:user.json').as('loadUser');

    cy.visit('/article/how-to-train-your-dragon', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.wait(['@loadComments', '@loadArticle',  '@loadFeatures', '@loadUser']);
    
    cy.get('.btn-outline-secondary').contains('Statistics').should('not.exist')
  });

  afterEach(() => {
    cy.screenshot();
    cy.reload();
  });
});
