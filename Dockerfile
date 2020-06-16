FROM node:12.18.0

WORKDIR /usr/src/smartbrain_back-end

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]