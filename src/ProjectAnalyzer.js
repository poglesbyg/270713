import { promises as fs } from 'fs';
import path from 'path';

export class ProjectAnalyzer {
    constructor() {
        this.projectInfo = {
            type: 'unknown',
            technologies: [],
            structure: {},
            complexity: 'medium',
            hasTests: false,
            hasDocumentation: false
        };
    }

    async analyzeProject(projectPath, description) {
        try {
            await this.scanProjectStructure(projectPath);
            await this.detectTechnologies(projectPath);
            this.analyzeDescription(description);
            this.calculateComplexity();
        } catch (error) {
            console.warn(`Could not analyze project at ${projectPath}: ${error.message}`);
            this.projectInfo.type = 'new';
            this.analyzeDescription(description);
        }
        
        return this.projectInfo;
    }

    async scanProjectStructure(projectPath) {
        try {
            const stats = await fs.stat(projectPath);
            if (!stats.isDirectory()) {
                this.projectInfo.type = 'new';
                return;
            }

            const files = await fs.readdir(projectPath);
            this.projectInfo.structure = await this.buildFileTree(projectPath, files);
            
            this.projectInfo.hasTests = files.some(file => 
                file.includes('test') || file.includes('spec') || file === '__tests__'
            );
            
            this.projectInfo.hasDocumentation = files.some(file => 
                file.toLowerCase().includes('readme') || file.toLowerCase().includes('doc')
            );
            
        } catch (error) {
            this.projectInfo.type = 'new';
        }
    }

    async buildFileTree(projectPath, files) {
        const tree = {};
        
        for (const file of files.slice(0, 20)) {
            try {
                const filePath = path.join(projectPath, file);
                const stats = await fs.stat(filePath);
                
                tree[file] = {
                    type: stats.isDirectory() ? 'directory' : 'file',
                    size: stats.size
                };
            } catch (error) {
                continue;
            }
        }
        
        return tree;
    }

    async detectTechnologies(projectPath) {
        const techIndicators = {
            'package.json': ['Node.js', 'JavaScript', 'TypeScript'],
            'requirements.txt': ['Python'],
            'Gemfile': ['Ruby'],
            'pom.xml': ['Java'],
            'Cargo.toml': ['Rust'],
            'go.mod': ['Go'],
            'composer.json': ['PHP'],
            '.csproj': ['C#'],
            'Dockerfile': ['Docker'],
            'docker-compose.yml': ['Docker'],
            'index.html': ['HTML', 'Web'],
            'style.css': ['CSS'],
            'app.js': ['JavaScript'],
            'main.py': ['Python'],
            'index.php': ['PHP']
        };

        for (const [fileName, techs] of Object.entries(techIndicators)) {
            if (this.projectInfo.structure[fileName]) {
                this.projectInfo.technologies.push(...techs);
            }
        }

        if (this.projectInfo.structure['src']) {
            this.projectInfo.type = 'structured';
        } else if (this.projectInfo.structure['package.json']) {
            this.projectInfo.type = 'node';
        } else if (this.projectInfo.structure['requirements.txt']) {
            this.projectInfo.type = 'python';
        } else if (Object.keys(this.projectInfo.structure).length > 0) {
            this.projectInfo.type = 'existing';
        } else {
            this.projectInfo.type = 'new';
        }

        this.projectInfo.technologies = [...new Set(this.projectInfo.technologies)];
    }

    analyzeDescription(description) {
        const desc = description.toLowerCase();
        
        const webKeywords = ['website', 'web', 'frontend', 'react', 'vue', 'angular'];
        const mobileKeywords = ['mobile', 'app', 'ios', 'android', 'react native'];
        const apiKeywords = ['api', 'backend', 'server', 'database', 'microservice'];
        const gameKeywords = ['game', 'unity', 'unreal', 'gaming'];
        
        if (webKeywords.some(keyword => desc.includes(keyword))) {
            this.projectInfo.type = this.projectInfo.type === 'unknown' ? 'web' : this.projectInfo.type;
        } else if (mobileKeywords.some(keyword => desc.includes(keyword))) {
            this.projectInfo.type = this.projectInfo.type === 'unknown' ? 'mobile' : this.projectInfo.type;
        } else if (apiKeywords.some(keyword => desc.includes(keyword))) {
            this.projectInfo.type = this.projectInfo.type === 'unknown' ? 'api' : this.projectInfo.type;
        } else if (gameKeywords.some(keyword => desc.includes(keyword))) {
            this.projectInfo.type = this.projectInfo.type === 'unknown' ? 'game' : this.projectInfo.type;
        }

        const techMentions = {
            'react': 'React',
            'vue': 'Vue.js',
            'angular': 'Angular',
            'node': 'Node.js',
            'express': 'Express',
            'python': 'Python',
            'django': 'Django',
            'flask': 'Flask',
            'java': 'Java',
            'spring': 'Spring',
            'docker': 'Docker',
            'kubernetes': 'Kubernetes'
        };

        for (const [keyword, tech] of Object.entries(techMentions)) {
            if (desc.includes(keyword) && !this.projectInfo.technologies.includes(tech)) {
                this.projectInfo.technologies.push(tech);
            }
        }
    }

    calculateComplexity() {
        let complexityScore = 0;
        
        complexityScore += this.projectInfo.technologies.length * 10;
        complexityScore += Object.keys(this.projectInfo.structure).length * 5;
        
        if (this.projectInfo.hasTests) complexityScore += 20;
        if (this.projectInfo.hasDocumentation) complexityScore += 10;
        
        if (this.projectInfo.type === 'new') complexityScore += 30;
        
        if (complexityScore < 50) {
            this.projectInfo.complexity = 'simple';
        } else if (complexityScore < 100) {
            this.projectInfo.complexity = 'medium';
        } else {
            this.projectInfo.complexity = 'complex';
        }
    }

    getProjectInfo() {
        return this.projectInfo;
    }
}