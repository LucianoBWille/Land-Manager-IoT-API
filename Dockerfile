# Using node:16 as base image
FROM node:16

# copying all project files to the image
COPY . .
# OBS: I'm using jenkins to clone the project from git, 
# so I only need to copy the files to the image

# installing dependencies
RUN npm install

# exposing port 3000
EXPOSE 3000

# running the app
CMD [ "node", "./bin/www" ]