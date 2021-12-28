describe('Blog app', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/testing/reset')
      const user = {
          username: "mockUser",
          password: "1234"
      }
      cy.request('POST', 'http://localhost:3003/api/users', user)
      cy.visit('http://localhost:3003')
    })
  
    it('Login form is shown', function() {
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', function(){
        it('succeeds with correct credentials', function() {
            cy.get('input:first').type('mockUser')
            cy.get('input:last').type('1234')
            cy.contains('login').click()
        })
    
        it('fails with wrong credentials', function() {
            cy.get('input:first').type('wrongUsername')
            cy.get('input:last').type('wrongPassword')
            cy.contains('login').click()

            cy.contains('username')
            cy.contains('password')
            cy.contains('login')
        })
    })

    describe('When logged in', function(){
        beforeEach(function() {
            cy.request('POST','http://localhost:3003/api/login', {
                username: 'mockUser', password: '1234'
            }).then(response => {
                localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
                cy.visit('http://localhost:3003')
            })
        })

        it('A blog can be created', function(){
            cy.contains('create').click()
            cy.contains('create').click()
            cy.get('#titleField').type('mockTitle')
            cy.get('#authorField').type('mockAuthor')
            cy.get('#urlField').type('mockUrl')
            cy.get('#createBlogButton').click()

            cy.contains('mockTitle')
            cy.contains('mockAuthor')
            cy.contains('view')
        })

        it('A blog can be liked', function() {
            cy.contains('create').click()
            cy.contains('create').click()
            cy.get('#titleField').type('mockTitle')
            cy.get('#authorField').type('mockAuthor')
            cy.get('#urlField').type('mockUrl')
            cy.get('#createBlogButton').click()

            cy.get('#viewButton').click()
            cy.get('#likeButton').click()
            cy.contains('1')
        })

        it('A blog can be deleted', function() {
            cy.contains('create').click()
            cy.contains('create').click()
            cy.get('#titleField').type('mockTitle')
            cy.get('#authorField').type('mockAuthor')
            cy.get('#urlField').type('mockUrl')
            cy.get('#createBlogButton').click()

            cy.get('#viewButton').click()

            cy.get('#deleteButton').click()
            cy.contains('mockTitle').should('not.exist')
            cy.contains('mockAuthor').should('not.exist')
            cy.contains('view').should('not.exist')
        })
    })
  })