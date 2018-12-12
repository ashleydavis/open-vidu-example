# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/xenial64"
  config.vm.network "public_network"
  config.vm.network "forwarded_port", guest: 80, host: 8000
  config.vm.network "forwarded_port", guest: 4443, host: 4443
  config.vm.provision "shell", path: "./scripts/provision.sh"

    config.vm.provider "virtualbox" do |v|
        v.memory = 16384
        v.cpus = 2
    end  
end
