/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.mjs` in your console
 */

import {extname} from 'path';
import inquirer from 'inquirer';
import {uploadImage} from './upload/uploader.js';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'; // Required for parsing arguments

// Define the `upload` command
yargs(hideBin(process.argv))
  .command({
    command: "upload",
    describe: "Upload file to your bucket",
    handler: () => {
      const routes = [
        {
          type: 'input',
          name: 'path',
          message: 'Enter your file path: ',
          validate(value) {
            if (fs.existsSync(value)) {
              return true;
            }
            return 'Please enter a valid file path!';
          },
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter your file name (it will include the date): ',
          filter(value) {
            return `${value}-${Date.now()}`;
          },
        },
      ];

      inquirer.prompt(routes).then((answers) => {
        const ext = extname(answers.path);
        answers.name = `${answers.name}${ext}`;
        uploadImage(answers.path, answers.name); // Implement `uploadImage` logic
      });
    },
  })
  .command({
    command: "updir",
    describe: "Upload file exsit in your directory to your bucket",
    handler: () => {
      const routes = [
        {
            type: 'list',
            name: 'files',
            message: 'Choase file you want to upload : ',
            choices: fs.readdirSync('./', (err, files) => {
                if (err) {
                  console.error('Error reading directory:', err);
                  return;
                }
                return files;
            }),
            filter(val) {
              return val.toLowerCase();
            }
        },
        {
          type: 'input',
          name: 'name',
          message: 'Enter your file name (it will include the date): ',
          filter(value) {
            return `${value}-${Date.now()}`;
          },
        },
      ];

      inquirer.prompt(routes).then((answers) => {
        const ext = extname(answers.files);
        answers.name = `${answers.name}${ext}`;
        uploadImage(answers.files, answers.name); // Implement `uploadImage` logic
      });
    },
  })
  .help()
  .argv; // Parse arguments

