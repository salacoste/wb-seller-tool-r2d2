FROM mysql:latest

COPY mysql_dump.sql /docker-entrypoint-initdb.d/

ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE root

EXPOSE 3306