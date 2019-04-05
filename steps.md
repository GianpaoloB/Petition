    ROUTES NEEDED FOR THE PROJECT:

    -   get /petition for the homepage

        -   it contains a form with a first name, a last name and a signature field

    -   post /petition template with error message if there's an error
        -   redirect to the thank you page after we set the cookie
    -   get /thanks (it's /petition/signed in the github notes)

        -   render the thanks template

    -   get /signers
        -   render the signers template

---

        TEMPLATES
        1. petition (page with the canvas and the dirst and last input fields)
        2. thanks
        3. signers
        4. layout
        5. (opt.) partials

---

        QUERIES

        INSERT INTO
        SELECT TO GET THE NAMES OF signers
        (OPT) SELECT TO GET THE NUMBERS OF SIGNERS

---

    REGISTRATION ROUTES
    * GET REGISTER
    * POST REGISTER
        * store userId in cookie cookieSession
    * GET login
    * POST login
        * store userid in cookie session
