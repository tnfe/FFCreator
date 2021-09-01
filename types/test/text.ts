import { FFAudio, FFCreator } from "ffcreator";
const path = require('path');
const colors = require('colors');


const createFFTask = () => {
    const bg1 = path.join(__dirname, './assets/imgs/bg/h04.jpg');
    const bg2 = path.join(__dirname, './assets/imgs/bg/h05.jpg');
    const logo1 = path.join(__dirname, './assets/imgs/logo/logo1.png');
    const logo2 = path.join(__dirname, './assets/imgs/logo/logo2.png');
    const cover = path.join(__dirname, './assets/imgs/cover/cover2.jpg');
    const money = path.join(__dirname, './assets/imgs/gif/m.gif');
    const audio = path.join(__dirname, './assets/audio/02.wav');
    const font1 = path.join(__dirname, './assets/font/font1.ttf');
    const font2 = path.join(__dirname, './assets/font/font2.ttf');
    const outputDir = path.join(__dirname, './output/');
    const cacheDir = path.join(__dirname, './cache/');

    // create creator instance
    const width = 800;
    const height = 600;

    const creator = new FFCreator({
        cacheDir,
        outputDir,
        width,
        height,
        parallel: 8
    });

    creator.addAudio(new FFAudio({
        path: audio,
        volume: 1,
        loop: true
    }))
}
