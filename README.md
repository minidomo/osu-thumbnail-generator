# osu! Thumbnail Generator
## Prerequisites
- [Node.js](https://nodejs.org/)
- HTML/CSS/JavaScript

## Getting Started
Clone the repository by typing the following into the command line.
```bash
git clone https://github.com/minidomo/osu-thumbnail-generator.git
```
Install the necessary dependencies by typing the following into the command line.
```bash
npm install
```

This program requires a file, `config.json`, in the current directory. An example of its structure and contents can be seen in the `config.json.example` file. 

For clarification, a player's user ID can be obtained through the URL of their profile as the URL follows the format, `https://osu.ppy.sh/users/<UserId>`. In addition, a beatmap's URL follows the format, `https://osu.ppy.sh/beatmapsets/<MapsetId>#osu/<BeatmapId>`.

## Running
Before running the program, the map provided in `config.json` must be downloaded onto your local computer in order to obtain the background of the beatmap.

This program requires a local web server to be run on. Use the provided script to launch the web server.
```bash
npm run server
```
Once the web server is launched, you can view the current state of the thumbnail at http://localhost:8080/. To run the remainder of the program, use the provided script.
```bash
npm run start
```
The resulting screenshot of the thumbnail will be located in the `./out/` folder. 

A full list of the provided scripts can be seen below.

| Name | Description |
|:-:|---|
| `clean` | Removes all files in the `./out/` folder. |
| `copy` | Copies the files needed from `./out/` to `./public/`. |
| `generate:raw` | Generates the images and data file used for the thumbnail and outputs to the `./out/` folder.  |
| `generate:ss` | Generates a screenshot of the current state of the thumbnail. |
| `start` | Runs the following scripts in the this order: `clean`, `generate:raw`, `copy`, `generate:ss`. |
