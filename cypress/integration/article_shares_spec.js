import { loadavg } from "os";

describe('Article Shares', () => {
  beforeEach(() => {
    cy.server();
  })

  it('Should success show shares - FEATURE TOGGLE ON', () => {
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon/, 'fixture:article.json').as('loadArticle');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/comments/, 'fixture:comments.json').as('loadComments');
    cy.route(/.*\/api\/features/, 'fixture:features_article-share-feature_on.json').as('loadFeatures');

    cy.visit('/article/how-to-train-your-dragon', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.wait(['@loadArticle', '@loadComments', '@loadFeatures']);
    cy.get('.share-container').should('exist');
    cy.get('.SocialMediaShareButton--facebook').should('exist');
    cy.get('.SocialMediaShareButton--twitter').should('exist');
    cy.get('.SocialMediaShareButton--linkedin').should('exist');
    cy.get('.SocialMediaShareButton--whatsapp').should('exist');
    cy.get('.SocialMediaShareButton--email').should('exist');
  });

  it('Should not show shares - FEATURE TOGGLE OFF', () => {
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon/, 'fixture:article.json').as('loadArticle');
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/comments/, 'fixture:comments.json').as('loadComments');
    cy.route(/.*\/api\/features/, 'fixture:features_article-share-feature_off.json').as('loadFeatures');

    cy.visit('/article/how-to-train-your-dragon', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.wait(['@loadArticle', '@loadComments', '@loadFeatures']);
    cy.get('.share-container').should('not.exist');
    cy.get('.SocialMediaShareButton--facebook').should('not.exist');
    cy.get('.SocialMediaShareButton--twitter').should('not.exist');
    cy.get('.SocialMediaShareButton--linkedin').should('not.exist');
    cy.get('.SocialMediaShareButton--whatsapp').should('not.exist');
    cy.get('.SocialMediaShareButton--email').should('not.exist');
  });


  afterEach(() => {
    cy.screenshot();
    cy.reload();
  });
});
