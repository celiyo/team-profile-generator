const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const render = require('./src/page-template.js');

// TODO: Write Code to gather information about the development team members, and render the HTML file.

const team = [];

const renderTeam = () => {
  return fs.writeFileSync(outputPath, render(team));
};

// Questions to add new team member
const questionNewTeamMember = [
  {
    name: 'newTeamMember',
    type: 'list',
    message: 'Would you like to add a new team member?',
    choices: ['Add an engineer', 'Add an intern', "I don't want to add any more team members"],
  },
];

// Questions pertaining to all types of employees
const questionsGeneral = (teamMemberType) => {
  return [
    {
      name: 'name',
      type: 'input',
      message: `What is the team ${teamMemberType}'s name?`,
      // If the name is empty or contains numbers, the user is prompted to enter at least one letter
      validate: (answer) => {
        const regex = /^[A-Za-z\s]*$/;
        return answer.match(regex) && answer.trim().length !== 0
          ? true
          : 'Please enter a valid name which contains only letters and spaces, and at least one character';
      },
    },
    {
      name: 'id',
      type: 'input',
      message: `What is the team ${teamMemberType}'s id?`,
      validate: (answer) => {
        const regex = /^[1-9]\d*$/;
        return answer.match(regex) ? true : 'Please enter a number greater than 0.';
      },
    },
    {
      name: 'email',
      type: 'input',
      message: `What is the team ${teamMemberType}'s email?`,
      validate: (answer) => {
        const regex = /\S+@\S+\.\S+/;
        return answer.match(regex) ? true : 'Please enter a valid email address.';
      },
    },
  ];
};

// Questions when adding a Manager
const questionsManager = (teamMemberType) => {
  return [
    ...questionsGeneral('manager'),
    {
      name: 'officeNumber',
      type: 'input',
      message: `What is the team ${teamMemberType}'s office number?`,
      validate: (answer) => {
        const regex = /^[1-9]\d*$/;
        return answer.match(regex) ? true : 'Please enter a number greater than 0.';
      },
    },
  ];
};

// Questions when adding an engineer
const questionsEngineer = (teamMemberType) => {
  return [
    ...questionsGeneral('engineer'),
    {
      name: 'github',
      type: 'input',
      message: `What is the team ${teamMemberType}'s GitHub name?`,
      // If the GitHub name is empty or contains numbers, the user is prompted to enter at least one letter
      validate: (answer) => {
        return answer.trim().length !== 0 ? true : 'Please enter at least one character';
      },
    },
  ];
};

// Questions when adding an intern
const questionsIntern = (teamMemberType) => {
  return [
    ...questionsGeneral('intern'),
    {
      name: 'school',
      type: 'input',
      message: `What is the team ${teamMemberType}'s school name?`,
      // If the school name is empty, the user is prompted to enter at least one letter
      validate: (answer) => {
        return answer.trim().length !== 0 ? true : 'Please enter at least one character';
      },
    },
  ];
};

// When adding the manager add the answers to the `team` array
const addManager = () => {
  inquirer.prompt(questionsManager('manager')).then((answers) => {
    const manager = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
    team.push(manager);
    addNewTeamMember();
  });
};

// When adding an engineer add the answers to the `team` array
const addEngineer = () => {
  inquirer.prompt(questionsEngineer('engineer')).then((answers) => {
    const engineer = new Engineer(answers.name, answers.id, answers.email, answers.github);
    team.push(engineer);
    addNewTeamMember();
  });
};

// When adding an intern add the answers to the `team` array
const addIntern = () => {
  inquirer.prompt(questionsIntern('intern')).then((answers) => {
    const intern = new Intern(answers.name, answers.id, answers.email, answers.school);
    team.push(intern);
    addNewTeamMember();
  });
};

// Depending on the answer given, select the relevant case
const addNewTeamMember = () => {
  inquirer.prompt(questionNewTeamMember).then((answers) => {
    const answer = answers.newTeamMember;
    switch (answer) {
      case 'Add an engineer':
        addEngineer();
        break;
      case 'Add an intern':
        addIntern();
        break;
      default:
        renderTeam();
        console.log('No more team members to add.');
    }
  });
};

// Start building the team
addManager();
