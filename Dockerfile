FROM node:14.15-alpine
WORKDIR /identity-x
ENV NODE_ENV production
ARG SERVICE

ADD package.json yarn.lock /identity-x/
ADD packages /identity-x/packages
ADD services/$SERVICE /identity-x/services/$SERVICE
RUN yarn --production --pure-lockfile

WORKDIR /identity-x/services/$SERVICE
ENTRYPOINT [ "node", "src/index.js" ]
