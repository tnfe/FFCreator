# mira player burner
FROM ubuntu:18.04

# 不要去选时区啥的
ENV DEBIAN_FRONTEND=noninteractive

# nodejs必须16以上
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get -y install nodejs yarn software-properties-common \
    libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ \
    libgl1-mesa-dev xvfb libxi-dev libx11-dev libopencv-dev vim git

# ffmpeg必须4.0以上
RUN add-apt-repository -y ppa:savoury1/ffmpeg4 && \
    apt-get update && \
    apt-get install -y ffmpeg && \
    ffmpeg -version && \
    add-apt-repository -y --remove ppa:savoury1/ffmpeg4

COPY ./FFCreator ./home/FFCreator
RUN cd /home/FFCreator/inkpaint && npm install
RUN cd /home/FFCreator && npm install

# install opencv
# RUN export OPENCV4NODEJS_DISABLE_AUTOBUILD=1 && \
#     export OPENCV_BIN_DIR=/usr/bin && \
#     export OPENCV_LIB_DIR=/usr/lib/x86_64-linux-gnu && \
#     export OPENCV_INCLUDE_DIR=/usr/include/opencv && \
#     npm install --save opencv4nodejs
