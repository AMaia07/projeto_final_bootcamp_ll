FROM nginx:alpine
COPY index.html style.css utils.js script.js favoritos.js /usr/share/nginx/html/
EXPOSE 80
