# This dockerfile builds an image for the backend package.
# It should be executed with the root of the repo as docker context.
#
# Before building this image, be sure to have run the following commands in the repo root:
#
# yarn install
# yarn tsc
# yarn build
#
# Once the commands have been run, you can build the image using `yarn build-image`

FROM node:14-buster-slim

WORKDIR /app

# Copy repo skeleton first, to avoid unnecessary docker cache invalidation.
# The skeleton contains the package.json of each package in the monorepo,
# and along with yarn.lock and the root package.json, that's enough to run yarn install.
COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

RUN yarn install --frozen-lockfile --production --network-timeout 300000 && rm -rf "$(yarn cache dir)"

# Then copy the rest of the backend bundle, along with any other files we might want.
COPY packages/backend/dist/bundle.tar.gz app-config.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# If you are running Backstage from a Docker container, you will want to avoid calling a container inside a container.
# This sets up Cookiecutter in your own image. This will have backstage use the local instead of the cookiecutter image.

RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install cookiecutter

CMD ["node", "packages/backend", "--config", "app-config.yaml"]
