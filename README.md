# open-vidu-example

Example of video conferencing based on OpenVidu.

This repo replicates Open Vidu Hello World with the web page delivered through a simple Node.js web server.
It contains Vagrant and Docker-Compose files that boots the OpenVidu server and the Node.js server.

Once you have booted the system (as per the following instructions) please point your browser at http://localhost:8000 to see the Hello World example.

## Booting the example under Vagrant

Have Vagrant and Virtual Box installed.

Run

    vagrant up

This boots an Ubuntu Linux VM with Docker and Docker-Compose Installed.

Shell in:

    vagrant ssh

Then change to the vagrant directory:

    cd /vagrant

Now follow the instructions in the next section.

## Booting the example using Docker-Compose

Have Docker and Docker-Compose installed (already installed if you are running under Vagrant, as per previous section).

Boot the system using Docker-Compose:

    docker-compose up --build

If running under Vagrant you may need to use sudo as follows:

    sudo docker-compose up --build

