export class TaskDistributor {
    constructor() {
        this.taskTemplates = {
            web: {
                'Frontend': [
                    'Setup component structure',
                    'Implement responsive design',
                    'Add interactive features',
                    'Optimize performance',
                    'Add accessibility features'
                ],
                'Backend': [
                    'Design API architecture',
                    'Implement data models',
                    'Add authentication',
                    'Setup rate limiting',
                    'Add logging and monitoring'
                ],
                'Full-Stack': [
                    'Setup project structure',
                    'Connect frontend and backend',
                    'Implement core workflows',
                    'Add error handling',
                    'Setup development tools'
                ],
                'DevOps': [
                    'Setup build pipeline',
                    'Configure deployment',
                    'Setup monitoring',
                    'Add health checks',
                    'Configure security'
                ],
                'Testing': [
                    'Write unit tests',
                    'Add integration tests',
                    'Setup test automation',
                    'Add performance tests',
                    'Create test documentation'
                ]
            },
            mobile: {
                'Frontend': [
                    'Setup navigation',
                    'Implement UI components',
                    'Add offline support',
                    'Optimize for mobile',
                    'Add push notifications'
                ],
                'Backend': [
                    'Design mobile API',
                    'Add data synchronization',
                    'Implement push services',
                    'Add offline data handling',
                    'Optimize for mobile networks'
                ]
            },
            api: {
                'Backend': [
                    'Design API endpoints',
                    'Implement data validation',
                    'Add rate limiting',
                    'Setup documentation',
                    'Add versioning'
                ],
                'Testing': [
                    'API endpoint testing',
                    'Load testing',
                    'Security testing',
                    'Documentation testing',
                    'Integration testing'
                ]
            }
        };
    }

    async distributeTasks(projectDescription, developers, projectInfo) {
        const projectType = this.detectProjectType(projectDescription, projectInfo);
        const tasks = [];
        let taskId = 1;

        developers.forEach(developer => {
            const specializationTasks = this.getTasksForSpecialization(
                developer.specialization, 
                projectType,
                projectDescription
            );

            specializationTasks.forEach(taskDesc => {
                tasks.push({
                    id: taskId++,
                    description: taskDesc,
                    assignedTo: developer.id,
                    specialization: developer.specialization,
                    priority: this.calculatePriority(taskDesc),
                    estimatedTime: this.estimateTime(taskDesc),
                    status: 'pending'
                });
            });
        });

        await this.delay(200);
        return tasks;
    }

    detectProjectType(description, projectInfo) {
        const desc = description.toLowerCase();
        
        if (desc.includes('web') || desc.includes('website') || desc.includes('frontend')) {
            return 'web';
        }
        if (desc.includes('mobile') || desc.includes('app') || desc.includes('ios') || desc.includes('android')) {
            return 'mobile';
        }
        if (desc.includes('api') || desc.includes('backend') || desc.includes('service')) {
            return 'api';
        }
        
        return 'web';
    }

    getTasksForSpecialization(specialization, projectType, description) {
        const templates = this.taskTemplates[projectType] || this.taskTemplates.web;
        const baseTasks = templates[specialization] || [];
        
        return this.customizeTasks(baseTasks, description, specialization);
    }

    customizeTasks(baseTasks, description, specialization) {
        const keywords = this.extractKeywords(description);
        const customizedTasks = [...baseTasks];

        if (keywords.includes('database') && specialization === 'Backend') {
            customizedTasks.push('Setup database migrations');
            customizedTasks.push('Optimize database queries');
        }

        if (keywords.includes('security') && specialization !== 'Testing') {
            customizedTasks.push('Implement security measures');
        }

        if (keywords.includes('performance')) {
            customizedTasks.push('Optimize application performance');
        }

        if (keywords.includes('deployment') && specialization === 'DevOps') {
            customizedTasks.push('Setup production deployment');
            customizedTasks.push('Configure environment variables');
        }

        return customizedTasks;
    }

    extractKeywords(description) {
        const keywords = [
            'database', 'security', 'performance', 'deployment', 
            'testing', 'authentication', 'monitoring', 'logging',
            'optimization', 'responsive', 'mobile', 'accessibility'
        ];
        
        return keywords.filter(keyword => 
            description.toLowerCase().includes(keyword)
        );
    }

    calculatePriority(taskDescription) {
        const highPriorityKeywords = ['setup', 'authentication', 'security', 'core'];
        const mediumPriorityKeywords = ['implement', 'add', 'configure'];
        
        const desc = taskDescription.toLowerCase();
        
        if (highPriorityKeywords.some(keyword => desc.includes(keyword))) {
            return 'high';
        }
        if (mediumPriorityKeywords.some(keyword => desc.includes(keyword))) {
            return 'medium';
        }
        
        return 'low';
    }

    estimateTime(taskDescription) {
        const complexKeywords = ['setup', 'implement', 'design'];
        const simpleKeywords = ['add', 'configure', 'optimize'];
        
        const desc = taskDescription.toLowerCase();
        
        if (complexKeywords.some(keyword => desc.includes(keyword))) {
            return Math.floor(Math.random() * 4) + 3;
        }
        if (simpleKeywords.some(keyword => desc.includes(keyword))) {
            return Math.floor(Math.random() * 3) + 1;
        }
        
        return Math.floor(Math.random() * 2) + 2;
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}