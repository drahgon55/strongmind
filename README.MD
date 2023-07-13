StrongMind
=========
## Installation

  - install docker
  - cd to root of the repo
  - docker build -t strongmind:latest .
  - docker run -p 8080:8080 strongmind:latest

## Usage
  - navigate to http://localhost:8080
  - To add a pizza or topping click the plus button
  - to edit just click on a pizza or topping row
  - to delete use the trash button next to a topping or pizza. 

# Testing, starts a local instance of the server and tests it
  This starts a local instance of the server and tests it using mocha

    NOTE: requires instaling and running mongodb locally

  - npm test

  Let me know if you have any questions!