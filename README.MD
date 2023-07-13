StrongMind
=========
## Installation

  - install docker
  - cd to root of the repo
  - docker build -t strongmind:latest .
  - docker run -p 8080:8080 strongmind:latest

## Usage
  - navigate to http://localhost:8080

# Testing, starts a local instance of the server and tests it
  This starts a local instance of the server and tests it using mocha

    NOTE: requires instaling and running mongodb locally

  - npm test