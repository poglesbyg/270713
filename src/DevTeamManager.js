import { AIDeveloper } from './AIDeveloper.js';
import { TaskDistributor } from './TaskDistributor.js';
import { ProjectAnalyzer } from './ProjectAnalyzer.js';
import { LiveFeed } from './LiveFeed.js';
import { LLMManager } from './LLMManager.js';

export class DevTeamManager {
    constructor() {
        this.developers = [];
        this.currentProject = null;
        this.projectDescription = '';
        this.taskDistributor = new TaskDistributor();
        this.projectAnalyzer = new ProjectAnalyzer();
        this.isWorking = false;
        this.liveFeed = new LiveFeed();
        this.llmManager = new LLMManager();
    }

    async configureTeam(size) {
        this.stopDevelopment();
        
        this.developers = [];
        for (let i = 0; i < size; i++) {
            const specialization = this.getSpecialization(i, size);
            const assignedModel = this.llmManager.getModelForSpecialization(specialization);
            const modelInfo = this.llmManager.findModelById(assignedModel);
            
            const developer = new AIDeveloper({
                id: i + 1,
                name: `AI-Dev-${i + 1}`,
                specialization: specialization,
                liveFeed: this.liveFeed,
                model: modelInfo
            });
            this.developers.push(developer);
        }
        
        await this.delay(500);
    }

    getSpecialization(index, teamSize) {
        const specializations = [
            'Frontend', 'Backend', 'Full-Stack', 'DevOps', 
            'Testing', 'Security', 'Database', 'Mobile'
        ];
        
        if (teamSize <= 3) {
            return ['Frontend', 'Backend', 'Full-Stack'][index % 3];
        }
        
        return specializations[index % specializations.length];
    }

    async assignProject(projectPath, description) {
        this.currentProject = projectPath;
        this.projectDescription = description;
        
        await this.projectAnalyzer.analyzeProject(projectPath, description);
        
        await this.delay(300);
    }

    async startDevelopment() {
        if (!this.currentProject || this.developers.length === 0) {
            throw new Error('No project or developers configured');
        }

        this.isWorking = true;
        
        const tasks = await this.taskDistributor.distributeTasks(
            this.projectDescription,
            this.developers,
            this.projectAnalyzer.getProjectInfo()
        );

        for (const developer of this.developers) {
            const assignedTasks = tasks.filter(task => task.assignedTo === developer.id);
            await developer.start(this.currentProject, assignedTasks);
        }
        
        this.startProgressMonitoring();
    }

    async stopDevelopment() {
        this.isWorking = false;
        
        for (const developer of this.developers) {
            await developer.stop();
        }
    }

    startProgressMonitoring() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        this.progressInterval = setInterval(() => {
            this.updateDeveloperProgress();
        }, 5000);
    }

    updateDeveloperProgress() {
        this.developers.forEach(dev => dev.simulateProgress());
    }

    getTeamSize() {
        return this.developers.length;
    }

    hasProject() {
        return !!this.currentProject;
    }

    getTeamStatus() {
        return {
            teamSize: this.developers.length,
            activeDevelopers: this.developers.filter(dev => dev.status === 'working').length,
            currentProject: this.currentProject,
            isWorking: this.isWorking,
            llmConfiguration: this.llmManager.getTeamConfiguration(),
            developers: this.developers.map(dev => ({
                name: dev.name,
                status: dev.status,
                specialization: dev.specialization,
                currentTask: dev.currentTask,
                progress: dev.progress,
                model: dev.model ? {
                    name: dev.model.name,
                    provider: dev.model.provider,
                    cost: dev.model.cost,
                    speed: dev.model.speed
                } : null
            }))
        };
    }

    getLiveFeed() {
        return this.liveFeed;
    }

    getLLMManager() {
        return this.llmManager;
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}