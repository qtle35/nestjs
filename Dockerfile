FROM node:18

# Create app directory, this is in our container/in our image
WORKDIR /nest-test/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND yarn.lock are copied
# where available (Yarn)
COPY package*.json yarn.lock ./

RUN yarn install --production
# If you are building your code for production
# RUN yarn install --production

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "node", "dist/main" ]

