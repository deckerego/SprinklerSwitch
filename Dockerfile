FROM debian:bookworm-slim

RUN apt-get update
RUN apt-get -y install devscripts npm python3-dateutil python3-distutils node-github-url-from-git npm2deb

COPY . /home
WORKDIR /home
CMD ["npm2deb", "create", "sprinklerswitch"]
