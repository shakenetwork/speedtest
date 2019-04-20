FROM php:7.3.1-apache
EXPOSE 80
WORKDIR /var/www/html/
COPY . /var/www/html
RUN ln -s /var/www/html /var/www/html/speedtest
CMD ["/usr/local/bin/apache2-foreground"]
