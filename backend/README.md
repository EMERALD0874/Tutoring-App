# Docere Backend

## Requirements

You will need to install Docker to run the database locally.

Postman or a similar API testing tool is recommended.

## Starting the DB

Build the DB image with `docker build -t docere-db:1 ./database`

-   docere-db:1 is the image tag and follows the name:version format. This name is arbitrary

After building the db, you can run the image by running `docker run -itd -p 5432:5432 --name="local-db" docere-db:1`

-   Use the same image tag you build previously
-   The name is purely for convenience, name it whatever you can remember
-   We expose the 5432 port since that is the default postgres port
-   the `-itd` flag basically says to run the database in the background and to allow connections
