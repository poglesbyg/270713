export class LLMManager {
    constructor() {
        this.availableModels = {
            'OpenAI': {
                'gpt-4o': {
                    name: 'GPT-4o',
                    provider: 'OpenAI',
                    capabilities: ['coding', 'reasoning', 'multimodal'],
                    cost: 'high',
                    speed: 'fast',
                    description: 'Latest GPT-4 model with enhanced capabilities'
                },
                'gpt-4o-mini': {
                    name: 'GPT-4o Mini',
                    provider: 'OpenAI',
                    capabilities: ['coding', 'reasoning'],
                    cost: 'medium',
                    speed: 'very-fast',
                    description: 'Smaller, faster version of GPT-4o'
                },
                'gpt-3.5-turbo': {
                    name: 'GPT-3.5 Turbo',
                    provider: 'OpenAI',
                    capabilities: ['coding', 'general'],
                    cost: 'low',
                    speed: 'very-fast',
                    description: 'Fast and cost-effective for most tasks'
                }
            },
            'Anthropic': {
                'claude-3.5-sonnet': {
                    name: 'Claude 3.5 Sonnet',
                    provider: 'Anthropic',
                    capabilities: ['coding', 'reasoning', 'analysis'],
                    cost: 'high',
                    speed: 'fast',
                    description: 'Excellent for complex coding and reasoning tasks'
                },
                'claude-3-haiku': {
                    name: 'Claude 3 Haiku',
                    provider: 'Anthropic',
                    capabilities: ['coding', 'general'],
                    cost: 'low',
                    speed: 'very-fast',
                    description: 'Fast and efficient for simpler tasks'
                }
            },
            'Google': {
                'gemini-pro': {
                    name: 'Gemini Pro',
                    provider: 'Google',
                    capabilities: ['coding', 'reasoning', 'multimodal'],
                    cost: 'medium',
                    speed: 'fast',
                    description: 'Google\'s advanced AI model'
                },
                'gemini-flash': {
                    name: 'Gemini Flash',
                    provider: 'Google',
                    capabilities: ['coding', 'general'],
                    cost: 'low',
                    speed: 'very-fast',
                    description: 'Optimized for speed and efficiency'
                }
            },
            'Local': {
                'codellama-34b': {
                    name: 'Code Llama 34B',
                    provider: 'Local',
                    capabilities: ['coding'],
                    cost: 'free',
                    speed: 'medium',
                    description: 'Open-source model specialized for coding'
                },
                'deepseek-coder': {
                    name: 'DeepSeek Coder',
                    provider: 'Local',
                    capabilities: ['coding'],
                    cost: 'free',
                    speed: 'medium',
                    description: 'Open-source coding specialist'
                }
            }
        };
        
        this.teamConfiguration = {
            defaultModel: 'claude-3.5-sonnet',
            specializationModels: {},
            fallbackModel: 'gpt-3.5-turbo'
        };
    }

    getAvailableProviders() {
        return Object.keys(this.availableModels);
    }

    getModelsForProvider(provider) {
        return this.availableModels[provider] || {};
    }

    getAllModels() {
        const allModels = [];
        for (const [provider, models] of Object.entries(this.availableModels)) {
            for (const [modelId, modelInfo] of Object.entries(models)) {
                allModels.push({
                    id: modelId,
                    ...modelInfo
                });
            }
        }
        return allModels;
    }

    setDefaultModel(modelId) {
        const model = this.findModelById(modelId);
        if (model) {
            this.teamConfiguration.defaultModel = modelId;
            return true;
        }
        return false;
    }

    setSpecializationModel(specialization, modelId) {
        const model = this.findModelById(modelId);
        if (model) {
            this.teamConfiguration.specializationModels[specialization] = modelId;
            return true;
        }
        return false;
    }

    getModelForSpecialization(specialization) {
        return this.teamConfiguration.specializationModels[specialization] || 
               this.teamConfiguration.defaultModel;
    }

    findModelById(modelId) {
        for (const provider of Object.values(this.availableModels)) {
            if (provider[modelId]) {
                return { id: modelId, ...provider[modelId] };
            }
        }
        return null;
    }

    getTeamConfiguration() {
        return {
            ...this.teamConfiguration,
            resolvedModels: this.getResolvedModels()
        };
    }

    getResolvedModels() {
        const resolved = {};
        const specializations = ['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Testing', 'Security', 'Database', 'Mobile'];
        
        for (const spec of specializations) {
            const modelId = this.getModelForSpecialization(spec);
            resolved[spec] = this.findModelById(modelId);
        }
        
        return resolved;
    }

    getOptimalModelForTask(taskType, complexity = 'medium') {
        const taskModelMap = {
            'frontend': ['gpt-4o', 'claude-3.5-sonnet', 'gemini-pro'],
            'backend': ['claude-3.5-sonnet', 'gpt-4o', 'gemini-pro'],
            'devops': ['gpt-4o', 'claude-3.5-sonnet', 'gemini-pro'],
            'testing': ['claude-3.5-sonnet', 'gpt-4o-mini', 'gemini-flash'],
            'debugging': ['claude-3.5-sonnet', 'gpt-4o', 'gemini-pro'],
            'optimization': ['claude-3.5-sonnet', 'gpt-4o', 'gemini-pro']
        };

        const complexityModifier = {
            'simple': 0,
            'medium': 1,
            'complex': 2
        };

        const recommendedModels = taskModelMap[taskType] || taskModelMap['backend'];
        const modelIndex = Math.min(recommendedModels.length - 1, complexityModifier[complexity] || 1);
        
        return recommendedModels[modelIndex];
    }

    validateConfiguration() {
        const issues = [];
        
        if (!this.findModelById(this.teamConfiguration.defaultModel)) {
            issues.push('Default model is not available');
        }
        
        for (const [spec, modelId] of Object.entries(this.teamConfiguration.specializationModels)) {
            if (!this.findModelById(modelId)) {
                issues.push(`Model for ${spec} specialization is not available`);
            }
        }
        
        return {
            isValid: issues.length === 0,
            issues
        };
    }

    getModelStats() {
        const models = this.getAllModels();
        const stats = {
            totalModels: models.length,
            byProvider: {},
            byCost: { free: 0, low: 0, medium: 0, high: 0 },
            bySpeed: { slow: 0, medium: 0, fast: 0, 'very-fast': 0 }
        };

        models.forEach(model => {
            stats.byProvider[model.provider] = (stats.byProvider[model.provider] || 0) + 1;
            stats.byCost[model.cost] = (stats.byCost[model.cost] || 0) + 1;
            stats.bySpeed[model.speed] = (stats.bySpeed[model.speed] || 0) + 1;
        });

        return stats;
    }

    resetToDefaults() {
        this.teamConfiguration = {
            defaultModel: 'claude-3.5-sonnet',
            specializationModels: {},
            fallbackModel: 'gpt-3.5-turbo'
        };
    }

    exportConfiguration() {
        return JSON.stringify(this.teamConfiguration, null, 2);
    }

    importConfiguration(configJson) {
        try {
            const config = JSON.parse(configJson);
            if (this.validateImportedConfig(config)) {
                this.teamConfiguration = { ...this.teamConfiguration, ...config };
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    validateImportedConfig(config) {
        return config && 
               typeof config === 'object' &&
               typeof config.defaultModel === 'string' &&
               typeof config.specializationModels === 'object';
    }
}