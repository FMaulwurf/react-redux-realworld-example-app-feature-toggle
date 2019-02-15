describe('Article Statistics', () => {
  before(() => {
    cy.server();
    const registeredUser = {
      username: 'jake',
      email: 'joe@doe.me',
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

    cy.visit('/login', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });

    cy.get('input[placeholder="Email"]').type(registeredUser.email);
    cy.get('input[placeholder="Password"]').type(`${registeredUser.password}{enter}`);

    cy.wait(['@postUser']);
  })

  // it('Should fail with invalid credentials', () => {
  //   cy.route({
  //     method: 'POST',
  //     url: /.*\/api\/users/,
  //     status: 422,
  //     response: {
  //       errors: { 'email or password': ['is invalid'] }
  //     }
  //   }).as('postUser');

  //   cy.get('input[placeholder="Email"]').type('joe@doe.me');
  //   cy.get('input[placeholder="Password"]').type('123456{enter}');

  //   cy.wait('@postUser');
  //   cy.get('.auth-page .error-messages > li');
  // });

  it('Should success loading shares', () => {
   
    cy.route(/.*\/api\/articles\/how-to-train-your-dragon\/statistics/, 'fixture:shares.json').as('loadShares');

    cy.visit('/articles/how-to-train-your-dragon/statistics', {
      // see https://github.com/cypress-io/cypress/issues/95#issuecomment-281273126
      onBeforeLoad(win) {
        win.fetch = null;
      }
    });
    
    cy.get('@dot').its('length').should('be', 7);

    cy.wait(['@loadShares']);
  });

  afterEach(() => {
    cy.screenshot();
    cy.reload();
  });
});