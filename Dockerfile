FROM debian:bookworm-slim

RUN apt-get update
RUN apt-get -y install devscripts npm dpkg debhelper-compat nodejs pkg-js-tools

COPY . /home
RUN tar Jcf /node-sprinklerswitch_2.0.0.orig.tar.xz /home
WORKDIR /home
RUN rm -rf .gitignore .git* .travis.yml
CMD ["dpkg-buildpackage", "-d"]
