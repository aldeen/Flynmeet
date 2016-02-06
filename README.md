# Flynmeet
## Description ##
It is supposed to become a advanced flightsearch for people wanted to meet around the world and willing to find the cheapest fare. It is based on airfare API such as Skyscanner initially which seems to meet our needs, but this will depends on the time we can have access to the API. Let's see how it goes, in anycase we can adapt ;).

## Technical architecture ##
The choice has been made to developp the back-end in python with DJANGO:
 - Call to the Airfare API
 - Database access/calls
 - Business logic


The front-end will be treating the information requested by the user and the technical choice has been made on jsAngular for his flexibility, capacity to make a nice UI and supported by Google makes it more reliable for the futur.

Both Back-end and Front-end will be communicating through REST API and Django REST Framework will be used. 
## Applications ##

Back-end
* Searchcontroller: Fare search management with API connection to the Airfare
** Browseflights (Skyscanner python library exists - Licence has to be checked though)
** API end point for all business operations

Front-end
* Cheapest Destination
* #TODO Cheapest Common Destination
* #TODO Get currencies / locales
* #TODO Get existing cities/Airports of every countries


Business Logic:
Business Operations:

## TBD ##
SearchFare:
GET /search Return Fares according to items passed
	
GetLastSearch
GET /search/x Return Fare x

SaveRoute
POST / Save Route

DeleteRoute
DELETE / Delete Saved route

login
logout
register

## Requirements ##
* Python 2.7
* Django 1.9
* Django Rest Framework
* Skyscanner python lib

So far style is managed by using bootstrap css, file called on the html using a link, but that will change in the future. We might download and insert the bootstrap.css directly into the project later and make out own change if the License allows it
Angularjs is also directly called inside the html, but will be later included in the project. At the stage, it's not really necessary

## Unit test ##
To be defined

## Complimentary information ##
I am using AWS with EC2 + RDS + S3 so far, or thinking about doing that. Still developping in local with a direct connection to the DB. I will also change that when it will become more serious.
