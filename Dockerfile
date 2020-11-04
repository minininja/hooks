# from arm32v7/node
from rancher/kubectl

RUN apt update -q && apt upgrade -y && apt install -y node

WORKDIR /usr/src/app
COPY package.json .
RUN npm install

ADD . /usr/src/app
RUN npm run tsc

CMD ["npm", "start"]

