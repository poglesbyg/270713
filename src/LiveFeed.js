import chalk from 'chalk';
import { EventEmitter } from 'events';

export class LiveFeed extends EventEmitter {
    constructor() {
        super();
        this.activities = [];
        this.maxActivities = 50;
        this.isActive = false;
        this.displayInterval = null;
    }

    start() {
        this.isActive = true;
        this.clearScreen();
        this.displayHeader();
        this.startLiveDisplay();
    }

    stop() {
        this.isActive = false;
        if (this.displayInterval) {
            clearInterval(this.displayInterval);
        }
    }

    addActivity(developerId, developerName, activity, type = 'info') {
        const timestamp = new Date();
        const activityEntry = {
            id: Date.now() + Math.random(),
            developerId,
            developerName,
            activity,
            type,
            timestamp
        };

        this.activities.unshift(activityEntry);
        
        if (this.activities.length > this.maxActivities) {
            this.activities = this.activities.slice(0, this.maxActivities);
        }

        if (this.isActive) {
            this.updateDisplay();
        }
    }

    startLiveDisplay() {
        this.displayInterval = setInterval(() => {
            if (this.isActive) {
                this.updateDisplay();
            }
        }, 1000);
    }

    clearScreen() {
        console.clear();
    }

    displayHeader() {
        console.log(chalk.blue.bold('📡 AI Developer Live Feed'));
        console.log(chalk.gray('Real-time activity from your AI development team'));
        console.log(chalk.gray('Press Ctrl+C to return to main menu\n'));
        console.log(chalk.gray('─'.repeat(80)));
    }

    updateDisplay() {
        process.stdout.write('\x1b[4;0H');
        this.displayActivities();
        this.displayFooter();
    }

    displayActivities() {
        const currentTime = new Date();
        
        if (this.activities.length === 0) {
            console.log(chalk.gray('  No activity yet... Waiting for AI developers to start working...'));
            return;
        }

        this.activities.slice(0, 20).forEach((activity, index) => {
            const timeAgo = this.getTimeAgo(activity.timestamp, currentTime);
            const icon = this.getActivityIcon(activity.type);
            const color = this.getActivityColor(activity.type);
            
            const line = `${icon} ${chalk.cyan(activity.developerName)} ${color(activity.activity)} ${chalk.gray(`(${timeAgo})`)}`;
            console.log(`  ${line}`);
        });

        for (let i = this.activities.length; i < 20; i++) {
            console.log('');
        }
    }

    displayFooter() {
        const stats = this.getActivityStats();
        console.log(chalk.gray('─'.repeat(80)));
        console.log(chalk.gray(`Total Activities: ${stats.total} | Last Update: ${stats.lastUpdate}`));
    }

    getActivityStats() {
        const now = new Date();
        const recentActivities = this.activities.filter(
            activity => now - activity.timestamp < 60000
        ).length;

        return {
            total: this.activities.length,
            recent: recentActivities,
            lastUpdate: now.toLocaleTimeString()
        };
    }

    getActivityIcon(type) {
        const icons = {
            'start': '🚀',
            'complete': '✅',
            'progress': '⚡',
            'error': '❌',
            'info': '💡',
            'testing': '🧪',
            'deploy': '🚢',
            'debug': '🐛',
            'review': '👀'
        };
        return icons[type] || '📝';
    }

    getActivityColor(type) {
        const colors = {
            'start': chalk.green,
            'complete': chalk.green.bold,
            'progress': chalk.yellow,
            'error': chalk.red,
            'info': chalk.white,
            'testing': chalk.blue,
            'deploy': chalk.magenta,
            'debug': chalk.red,
            'review': chalk.cyan
        };
        return colors[type] || chalk.white;
    }

    getTimeAgo(timestamp, currentTime) {
        const diff = currentTime - timestamp;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return `${seconds}s ago`;
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    }

    generateSampleActivity(developerId, developerName, specialization) {
        const activities = this.getActivitiesForSpecialization(specialization);
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const type = this.getRandomActivityType();
        
        return {
            activity: randomActivity,
            type
        };
    }

    getActivitiesForSpecialization(specialization) {
        const activities = {
            'Frontend': [
                'Implementing React component structure',
                'Adding responsive CSS styling',
                'Optimizing bundle size with Webpack',
                'Creating interactive user interface',
                'Adding accessibility features',
                'Implementing state management',
                'Setting up component testing',
                'Fixing cross-browser compatibility issues'
            ],
            'Backend': [
                'Designing REST API endpoints',
                'Implementing database schema',
                'Adding authentication middleware',
                'Optimizing database queries',
                'Setting up error handling',
                'Implementing rate limiting',
                'Adding logging and monitoring',
                'Configuring security headers'
            ],
            'Full-Stack': [
                'Connecting frontend to backend APIs',
                'Setting up development environment',
                'Implementing core application features',
                'Adding integration tests',
                'Configuring build pipeline',
                'Setting up project documentation',
                'Implementing error boundaries',
                'Adding environment configuration'
            ],
            'DevOps': [
                'Setting up CI/CD pipeline',
                'Configuring Docker containers',
                'Deploying to production environment',
                'Setting up monitoring and alerts',
                'Configuring load balancing',
                'Implementing backup strategies',
                'Setting up security scanning',
                'Optimizing infrastructure costs'
            ],
            'Testing': [
                'Writing unit tests for components',
                'Adding integration test suite',
                'Setting up end-to-end testing',
                'Implementing test automation',
                'Adding performance benchmarks',
                'Creating test documentation',
                'Setting up test coverage reports',
                'Adding security vulnerability tests'
            ]
        };

        return activities[specialization] || activities['Full-Stack'];
    }

    getRandomActivityType() {
        const types = ['progress', 'info', 'testing', 'complete', 'debug'];
        return types[Math.floor(Math.random() * types.length)];
    }
}