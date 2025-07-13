export class AIDeveloper {
    constructor({ id, name, specialization, liveFeed = null, model = null }) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.status = 'idle';
        this.currentTask = null;
        this.progress = 0;
        this.tasks = [];
        this.projectPath = null;
        this.liveFeed = liveFeed;
        this.activityInterval = null;
        this.model = model;
    }

    async start(projectPath, tasks) {
        this.projectPath = projectPath;
        this.tasks = tasks;
        this.status = 'working';
        
        if (tasks.length > 0) {
            this.currentTask = tasks[0].description;
            this.progress = 0;
        }
        
        this.logActivity(`Starting work on project using ${this.model?.name || 'default model'}`, 'start');
        this.startWorking();
        this.startActivityLogging();
    }

    async stop() {
        this.status = 'idle';
        this.currentTask = null;
        this.progress = 0;
        
        if (this.workInterval) {
            clearInterval(this.workInterval);
        }
        
        if (this.activityInterval) {
            clearInterval(this.activityInterval);
        }
        
        this.logActivity('Stopped working', 'info');
    }

    startWorking() {
        if (this.workInterval) {
            clearInterval(this.workInterval);
        }
        
        this.workInterval = setInterval(() => {
            this.simulateWork();
        }, 2000);
    }

    simulateWork() {
        if (this.status !== 'working' || this.tasks.length === 0) {
            return;
        }

        this.progress += Math.random() * 15 + 5;
        
        if (Math.random() < 0.4) {
            this.logActivity(this.generateProgressActivity(), 'progress');
        }
        
        if (this.progress >= 100) {
            this.completeCurrentTask();
        }
    }

    completeCurrentTask() {
        if (this.tasks.length > 0) {
            const completedTask = this.tasks.shift();
            this.logActivity(`Completed: ${completedTask.description}`, 'complete');
            this.progress = 0;
            
            if (this.tasks.length > 0) {
                this.currentTask = this.tasks[0].description;
                this.logActivity(`Started: ${this.currentTask}`, 'start');
            } else {
                this.currentTask = 'Waiting for new tasks...';
                this.status = 'idle';
                this.logActivity('All tasks completed, waiting for new assignments', 'info');
            }
        }
    }

    simulateProgress() {
        if (this.status === 'working' && this.currentTask) {
            const progressMessages = [
                'Analyzing code structure...',
                'Writing implementation...',
                'Running tests...',
                'Fixing bugs...',
                'Optimizing performance...',
                'Adding documentation...',
                'Code review...',
                'Refactoring...'
            ];
            
            if (Math.random() < 0.3) {
                this.currentTask = progressMessages[Math.floor(Math.random() * progressMessages.length)];
            }
        }
    }

    getTasksForSpecialization(projectType) {
        const taskMap = {
            'Frontend': [
                'Setup React components',
                'Implement UI/UX design',
                'Add responsive styling',
                'Configure routing',
                'Optimize bundle size'
            ],
            'Backend': [
                'Design API endpoints',
                'Setup database schema',
                'Implement authentication',
                'Add error handling',
                'Optimize queries'
            ],
            'Full-Stack': [
                'Connect frontend to backend',
                'Setup development environment',
                'Implement core features',
                'Add integration tests',
                'Deploy application'
            ],
            'DevOps': [
                'Setup CI/CD pipeline',
                'Configure deployment',
                'Monitor performance',
                'Setup logging',
                'Security hardening'
            ],
            'Testing': [
                'Write unit tests',
                'Add integration tests',
                'Setup test automation',
                'Performance testing',
                'Security testing'
            ]
        };

        return taskMap[this.specialization] || ['General development tasks'];
    }

    startActivityLogging() {
        if (this.activityInterval) {
            clearInterval(this.activityInterval);
        }
        
        this.activityInterval = setInterval(() => {
            if (this.status === 'working' && Math.random() < 0.6) {
                const activity = this.generateRandomActivity();
                this.logActivity(activity.message, activity.type);
            }
        }, 3000 + Math.random() * 4000);
    }

    generateRandomActivity() {
        const activities = this.getActivitiesForSpecialization();
        const types = ['progress', 'info', 'testing', 'debug', 'review'];
        
        return {
            message: activities[Math.floor(Math.random() * activities.length)],
            type: types[Math.floor(Math.random() * types.length)]
        };
    }

    generateProgressActivity() {
        const progressActivities = [
            'Analyzing code structure',
            'Writing implementation',
            'Running tests',
            'Fixing syntax errors',
            'Optimizing performance',
            'Adding documentation',
            'Code review in progress',
            'Refactoring components',
            'Updating dependencies',
            'Configuring build tools'
        ];
        
        return progressActivities[Math.floor(Math.random() * progressActivities.length)];
    }

    getActivitiesForSpecialization() {
        const activities = {
            'Frontend': [
                'Implementing React component architecture',
                'Adding responsive CSS grid layout',
                'Optimizing bundle size with tree shaking',
                'Creating interactive animations',
                'Adding accessibility ARIA labels',
                'Implementing state management with Redux',
                'Setting up component unit tests',
                'Fixing cross-browser compatibility issues',
                'Adding PWA service worker',
                'Optimizing image loading performance'
            ],
            'Backend': [
                'Designing RESTful API endpoints',
                'Implementing database migrations',
                'Adding JWT authentication middleware',
                'Optimizing SQL query performance',
                'Setting up comprehensive error handling',
                'Implementing API rate limiting',
                'Adding structured logging',
                'Configuring CORS and security headers',
                'Setting up database indexing',
                'Implementing caching strategy'
            ],
            'Full-Stack': [
                'Connecting React frontend to Express API',
                'Setting up development environment',
                'Implementing user authentication flow',
                'Adding real-time websocket features',
                'Configuring build and deployment pipeline',
                'Setting up API documentation',
                'Implementing error boundaries',
                'Adding environment configuration',
                'Setting up monitoring dashboards',
                'Implementing feature toggles'
            ],
            'DevOps': [
                'Setting up Docker containerization',
                'Configuring Kubernetes deployment',
                'Setting up CI/CD with GitHub Actions',
                'Implementing infrastructure as code',
                'Configuring load balancer',
                'Setting up monitoring and alerting',
                'Implementing backup and recovery',
                'Setting up security scanning',
                'Optimizing cloud infrastructure costs',
                'Configuring auto-scaling policies'
            ],
            'Testing': [
                'Writing comprehensive unit tests',
                'Adding integration test coverage',
                'Setting up end-to-end testing',
                'Implementing visual regression testing',
                'Adding performance benchmarking',
                'Creating automated test reports',
                'Setting up test data factories',
                'Adding security penetration tests',
                'Implementing load testing scenarios',
                'Setting up test environment automation'
            ]
        };

        return activities[this.specialization] || activities['Full-Stack'];
    }

    logActivity(message, type = 'info') {
        if (this.liveFeed) {
            this.liveFeed.addActivity(this.id, this.name, message, type);
        }
    }
}