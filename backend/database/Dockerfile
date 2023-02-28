FROM postgres

ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB postgres
EXPOSE 5432

COPY database.sql /docker-entrypoint-initdb.d/
