FROM node:14-bullseye

WORKDIR /app

# -> Update base image
RUN apt-get update --yes -qq --option Acquire::Retries=5 > /dev/null && \
    apt-get install --yes -qq --option Acquire::Retries=5 > /dev/null && \
    apt-get autoclean --yes -qq > /dev/null && \
    apt-get autoremove --yes -qq > /dev/null

# -> Copy sources
COPY . .

# -> Restore dependencies
RUN yarn install

# -> Expose
EXPOSE 8081
CMD [ "yarn", "start" ]
