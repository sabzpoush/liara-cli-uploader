/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.mjs` in your console
 */

import {extname} from 'path';
import inquirer from 'inquirer';
import {uploadImage} from './uploader.js';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers'; // Required for parsing arguments



const questions = [
  {
    type: 'confirm',
    name: 'toBeDelivered',
    message: 'Is this for delivery?',
    default: true,
    transformer: (answer) => (answer ? '👍' : '👎'),
  },
  {
    type: 'input',
    name: 'phone',
    message: "What's your phone number?",
    validate(value) {
      const pass = value.match(
        /^([01])?[\s.-]?\(?(\d{3})\)?[\s.-]?(\d{3})[\s.-]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?)(?:\d+)?)?$/i,
      );
      if (pass) {
        return true;
      }

      return 'Please enter a valid phone number';
    },
  },
  {
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
    choices: ['Large', 'Medium', 'Small'],
    filter(val) {
      return val.toLowerCase();
    },
  },
  {
    type: 'input',
    name: 'quantity',
    message: 'How many do you need?',
    validate(value) {
      const valid = !Number.isNaN(Number.parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
  },
  {
    type: 'expand',
    name: 'toppings',
    message: 'What about the toppings?',
    choices: [
      {
        key: 'p',
        name: 'Pepperoni and cheese',
        value: 'PepperoniCheese',
      },
      {
        key: 'a',
        name: 'All dressed',
        value: 'alldressed',
      },
      {
        key: 'w',
        name: 'Hawaiian',
        value: 'hawaiian',
      },
    ],
  },
  {
    type: 'rawlist',
    name: 'beverage',
    message: 'You also get a free 2L beverage',
    choices: ['Pepsi', '7up', 'Coke'],
  },
  {
    type: 'input',
    name: 'comments',
    message: 'Any comments on your purchase experience?',
    default: 'Nope, all good!',
  },
  {
    type: 'list',
    name: 'prize',
    message: 'For leaving a comment, you get a freebie',
    choices: ['cake', 'fries'],
    when(answers) {
      return answers.comments !== 'Nope, all good!';
    },
  },
];


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

