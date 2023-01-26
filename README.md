# property-service
## I. Overview
A simple API service which abstracts calls made to third-party services and returns first-party appropriate responses.

## Tenets
I realize that you may not be as familiar with Node, so I will share a bit about this service's key design philosophies:
* **Configuration First:** I generally loathe hardcoded values. With the right library in place, most hardcoded values can be easily managed from a centralized location.
* **Auth Through JWT:** Although I disabled validation in this package for simplicty, this service prefers authentication via a JSON Web Token.
* **Request Validation Through Middleware:** I am not a fan of validating request schemas programmatically. My schemas are set via configuration and are validated through middleware function (before any other application logic is executed).
* **Automated Quality Enforcement:** I included a linter inside of this package. Not only does it enforce certain quality standards, it will also clean up *most* of your code for you too (`npm run lint-fix`).
* **Mocking Through HTTP Interception:** Rather than mocking and replacing an entire HTTP client's functionality during testing, I use an HTTP interceptor to catch requests and return predefined responses. This reduces the chances of false positives as I am not modifying the behavior of my HTTP clients.

## II. Setup
### Installation

First, clone the package. Ensure that you have Node.js installed as well (latest version).

Once the package is pulled locally, simply navigate from your terminal to the package's root directory and perform the following command.

    $ npm install

### Configuration

In order to set your credentials for HouseCanary, navigate to `<package_root>/config/default.js` and modify the value under `clients.houseCanary`.

**Note:** If after setting these values you are receiving API failures, it is *likely* because HouseCanary does not want your credentials base64 encoded. If that is the case, go to `/src/clients/house-canary-client` and remove the `btoa` call from the source.

### Running

To run this package, simply call the following from your terminal.

    $ npm start

You may make the following CURL command to perform a test.

    $ curl --location --request GET '127.0.0.1:8080/property?address=1234 Fake Street&zipcode=22315'

### Testing

You'll find that I have packaged this with unit tests, a linter, and a coverage tool. In order to run these, perform the following commands from your terminal:

Testing:

    $ npm test

Linting:

    $ npm run lint

Coverage:

    $ npm run coverage

## Considerations

Below are some general observations/changes I might make before deploying this service to a production environment:

* **Data Reconciliation:** We are only calling one API here so we do not need to worry about conflicting data (i.e. two APIs returning different results for the same property). Once another client is introduced, we would need to resolve that eventually. One option could be to use a `lastUpdateDate` (or similar) property, assuming each API provides such a field. 
* **Data Warehousing:** If your 3rd party platforms will permit you to do so, it may be worth ETLing their data to a centralized warehouse and querying that instead of making numerous API calls. Caching may be another alternative as well. ETLing your data in this manner allows you to remove data reconciliation from your API service(s), making them faster, and prevents a single slow API call from impacting your service's response time.
* **JWT Verification:** Verifying that we indeed signed the JWT token should ideally not happen within this service. That is job best left for an API Gateway/@Edge function to manage. Doing so reduces this service's vulnerability to a DDOS attack.
* **Clients as Libraries:** I have included a HomeCanary client in this project's source code, but I would normally put it into its own repository/package and import it as a dependency. In doing so, I would also permit implementers to set the auth values programmatically (currently, it's done via configuration).
