# AI Junior Developer Team Manager

A command-line tool for managing a team of AI developers to work on your projects.

## Features

- **Team Configuration**: Specify how many AI developers you want (1-10)
- **Project Assignment**: Point the team to any project directory with a description
- **Smart Task Distribution**: Automatically distributes tasks based on developer specializations
- **Real-time Progress Tracking**: Monitor what each AI developer is working on
- **Project Analysis**: Analyzes project structure and technologies to optimize task assignment

## Installation

```bash
npm install
```

## Usage

Start the interactive CLI:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

## How It Works

1. **Configure Team**: Choose how many AI developers you want (each gets a specialization like Frontend, Backend, DevOps, etc.)
2. **Assign Project**: Provide a project directory path and describe what you want built
3. **Start Development**: The AI team analyzes your project and starts working with distributed tasks
4. **Monitor Progress**: View real-time status of each developer and their current tasks

## Developer Specializations

- **Frontend**: UI/UX, React components, styling, responsive design
- **Backend**: APIs, databases, authentication, server logic
- **Full-Stack**: Project setup, integration, core workflows
- **DevOps**: CI/CD, deployment, monitoring, infrastructure
- **Testing**: Unit tests, integration tests, test automation
- **Security**: Security measures, vulnerability assessment
- **Database**: Schema design, query optimization, migrations
- **Mobile**: Mobile app development, native features

## Architecture

- `DevTeamManager`: Core orchestration and team management
- `AIDeveloper`: Individual AI developer simulation with specializations
- `TaskDistributor`: Intelligent task assignment based on project type and developer skills
- `ProjectAnalyzer`: Analyzes project structure, technologies, and complexity
- `CLI`: Interactive command-line interface

## Example Workflow

```bash
$ npm start

🤖 AI Junior Developer Team Manager
Manage your AI development team

? What would you like to do? Configure Team Size
? How many AI developers do you want to hire? 3
✅ Team configured with 3 AI developers

? What would you like to do? Assign Project
? Enter the project directory path: ./my-web-app
? Describe what you want the team to work on: Build a modern e-commerce website with React
✅ Project assigned to team

? What would you like to do? Start Development
✅ Development started! AI team is now working on your project

? What would you like to do? View Team Status

📊 Team Status
──────────────────────────────────────────────────
Team Size: 3
Active Developers: 3
Current Project: ./my-web-app
Status: Working

👥 Developer Details:
  1. AI-Dev-1 (Frontend) - working
     Task: Implementing responsive design...
  2. AI-Dev-2 (Backend) - working  
     Task: Setting up API endpoints...
  3. AI-Dev-3 (Full-Stack) - working
     Task: Configuring project structure...
```

## License

MIT