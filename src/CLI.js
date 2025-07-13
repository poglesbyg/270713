import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

export class CLI {
    async start(manager) {
        console.log(chalk.blue.bold('🤖 AI Junior Developer Team Manager'));
        console.log(chalk.gray('Manage your AI development team\n'));

        while (true) {
            const { action } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        { name: '👥 Configure Team Size', value: 'configure' },
                        { name: '🤖 Configure AI Models', value: 'llm' },
                        { name: '🎯 Assign Project', value: 'assign' },
                        { name: '📊 View Team Status', value: 'status' },
                        { name: '🔄 Start Development', value: 'start' },
                        { name: '📡 Live Activity Feed', value: 'livefeed' },
                        { name: '⏹️  Stop All Developers', value: 'stop' },
                        { name: '🚪 Exit', value: 'exit' }
                    ]
                }
            ]);

            switch (action) {
                case 'configure':
                    await this.configureTeam(manager);
                    break;
                case 'llm':
                    await this.configureLLMs(manager);
                    break;
                case 'assign':
                    await this.assignProject(manager);
                    break;
                case 'status':
                    await this.showStatus(manager);
                    break;
                case 'start':
                    await this.startDevelopment(manager);
                    break;
                case 'livefeed':
                    await this.showLiveFeed(manager);
                    break;
                case 'stop':
                    await this.stopDevelopment(manager);
                    break;
                case 'exit':
                    console.log(chalk.green('Goodbye!'));
                    return;
            }
        }
    }

    async configureTeam(manager) {
        const { teamSize } = await inquirer.prompt([
            {
                type: 'number',
                name: 'teamSize',
                message: 'How many AI developers do you want to hire?',
                default: 3,
                validate: (input) => input > 0 && input <= 10 || 'Please enter a number between 1 and 10'
            }
        ]);

        const spinner = ora('Configuring AI development team...').start();
        await manager.configureTeam(teamSize);
        spinner.succeed(chalk.green(`✅ Team configured with ${teamSize} AI developers`));
    }

    async assignProject(manager) {
        if (manager.getTeamSize() === 0) {
            console.log(chalk.yellow('⚠️  Please configure your team first'));
            return;
        }

        const { projectPath, description } = await inquirer.prompt([
            {
                type: 'input',
                name: 'projectPath',
                message: 'Enter the project directory path:',
                validate: (input) => input.trim() !== '' || 'Project path cannot be empty'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Describe what you want the team to work on:',
                validate: (input) => input.trim() !== '' || 'Description cannot be empty'
            }
        ]);

        const spinner = ora('Assigning project to AI development team...').start();
        await manager.assignProject(projectPath.trim(), description.trim());
        spinner.succeed(chalk.green('✅ Project assigned to team'));
    }

    async showStatus(manager) {
        const status = manager.getTeamStatus();
        
        console.log(chalk.blue.bold('\n📊 Team Status'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(`Team Size: ${chalk.cyan(status.teamSize)}`);
        console.log(`Active Developers: ${chalk.green(status.activeDevelopers)}`);
        console.log(`Current Project: ${chalk.yellow(status.currentProject || 'None')}`);
        console.log(`Status: ${status.isWorking ? chalk.green('Working') : chalk.gray('Idle')}`);
        
        if (status.developers.length > 0) {
            console.log(chalk.blue('\n👥 Developer Details:'));
            status.developers.forEach((dev, index) => {
                const statusColor = dev.status === 'working' ? chalk.green : 
                                  dev.status === 'idle' ? chalk.yellow : chalk.gray;
                console.log(`  ${index + 1}. ${chalk.cyan(dev.name)} (${dev.specialization}) - ${statusColor(dev.status)}`);
                if (dev.model) {
                    const costColor = dev.model.cost === 'free' ? chalk.green : 
                                    dev.model.cost === 'low' ? chalk.yellow : 
                                    dev.model.cost === 'medium' ? chalk.orange : chalk.red;
                    console.log(`     Model: ${chalk.white(dev.model.name)} (${dev.model.provider}) - ${costColor(dev.model.cost)} cost`);
                }
                if (dev.currentTask) {
                    console.log(`     Task: ${chalk.gray(dev.currentTask)}`);
                }
            });

            console.log(chalk.blue('\n🤖 LLM Configuration:'));
            const defaultModel = status.llmConfiguration.resolvedModels?.['Frontend'] || 
                               { name: 'Unknown', provider: 'Unknown' };
            console.log(`  Default Model: ${chalk.cyan(defaultModel.name)} (${defaultModel.provider})`);
            
            const customModels = Object.keys(status.llmConfiguration.specializationModels || {}).length;
            if (customModels > 0) {
                console.log(`  Custom Specialization Models: ${chalk.yellow(customModels)} configured`);
            }
        }
        console.log();
    }

    async startDevelopment(manager) {
        if (manager.getTeamSize() === 0) {
            console.log(chalk.yellow('⚠️  Please configure your team first'));
            return;
        }

        if (!manager.hasProject()) {
            console.log(chalk.yellow('⚠️  Please assign a project first'));
            return;
        }

        const spinner = ora('Starting AI development team...').start();
        await manager.startDevelopment();
        spinner.succeed(chalk.green('✅ Development started! AI team is now working on your project'));
    }

    async showLiveFeed(manager) {
        if (manager.getTeamSize() === 0) {
            console.log(chalk.yellow('⚠️  Please configure your team first'));
            return;
        }

        const liveFeed = manager.getLiveFeed();
        
        console.log(chalk.blue('Starting live activity feed...'));
        console.log(chalk.gray('Press Ctrl+C to return to main menu'));
        
        await new Promise((resolve) => {
            liveFeed.start();
            
            process.on('SIGINT', () => {
                liveFeed.stop();
                console.log(chalk.green('\nReturning to main menu...'));
                resolve();
            });
            
            setTimeout(() => {
                if (!liveFeed.isActive) return;
                
                const handleExit = () => {
                    liveFeed.stop();
                    resolve();
                };
                
                process.stdin.setRawMode(true);
                process.stdin.resume();
                process.stdin.on('data', (data) => {
                    if (data[0] === 3 || data[0] === 27) {
                        process.stdin.setRawMode(false);
                        process.stdin.pause();
                        handleExit();
                    }
                });
            }, 100);
        });
    }

    async configureLLMs(manager) {
        const llmManager = manager.getLLMManager();
        
        while (true) {
            const { llmAction } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'llmAction',
                    message: 'LLM Configuration Options:',
                    choices: [
                        { name: '🏠 Set Default Model', value: 'default' },
                        { name: '🎯 Configure Models by Specialization', value: 'specialization' },
                        { name: '📋 View All Available Models', value: 'view' },
                        { name: '📊 View Current Configuration', value: 'current' },
                        { name: '💡 Get Model Recommendations', value: 'recommend' },
                        { name: '🔄 Reset to Defaults', value: 'reset' },
                        { name: '⬅️  Back to Main Menu', value: 'back' }
                    ]
                }
            ]);

            switch (llmAction) {
                case 'default':
                    await this.setDefaultModel(llmManager);
                    break;
                case 'specialization':
                    await this.configureSpecializationModels(llmManager);
                    break;
                case 'view':
                    await this.viewAllModels(llmManager);
                    break;
                case 'current':
                    await this.viewCurrentConfig(llmManager);
                    break;
                case 'recommend':
                    await this.showModelRecommendations(llmManager);
                    break;
                case 'reset':
                    await this.resetLLMConfig(llmManager);
                    break;
                case 'back':
                    return;
            }
        }
    }

    async setDefaultModel(llmManager) {
        const models = llmManager.getAllModels();
        const choices = models.map(model => ({
            name: `${model.name} (${model.provider}) - ${model.cost} cost, ${model.speed} speed`,
            value: model.id,
            short: model.name
        }));

        const { defaultModel } = await inquirer.prompt([
            {
                type: 'list',
                name: 'defaultModel',
                message: 'Choose default AI model for your team:',
                choices,
                pageSize: 10
            }
        ]);

        llmManager.setDefaultModel(defaultModel);
        const model = llmManager.findModelById(defaultModel);
        console.log(chalk.green(`✅ Default model set to ${model.name}`));
    }

    async configureSpecializationModels(llmManager) {
        const specializations = ['Frontend', 'Backend', 'Full-Stack', 'DevOps', 'Testing', 'Security', 'Database', 'Mobile'];
        
        const { specialization } = await inquirer.prompt([
            {
                type: 'list',
                name: 'specialization',
                message: 'Choose specialization to configure:',
                choices: specializations.map(spec => ({
                    name: `${spec} (current: ${llmManager.findModelById(llmManager.getModelForSpecialization(spec))?.name || 'Default'})`,
                    value: spec
                }))
            }
        ]);

        const models = llmManager.getAllModels();
        const choices = [
            { name: '🏠 Use Default Model', value: 'default' },
            ...models.map(model => ({
                name: `${model.name} (${model.provider}) - ${model.cost} cost, ${model.speed} speed`,
                value: model.id,
                short: model.name
            }))
        ];

        const { selectedModel } = await inquirer.prompt([
            {
                type: 'list',
                name: 'selectedModel',
                message: `Choose AI model for ${specialization} developers:`,
                choices,
                pageSize: 12
            }
        ]);

        if (selectedModel === 'default') {
            delete llmManager.teamConfiguration.specializationModels[specialization];
            console.log(chalk.green(`✅ ${specialization} will use the default model`));
        } else {
            llmManager.setSpecializationModel(specialization, selectedModel);
            const model = llmManager.findModelById(selectedModel);
            console.log(chalk.green(`✅ ${specialization} model set to ${model.name}`));
        }
    }

    async viewAllModels(llmManager) {
        const providers = llmManager.getAvailableProviders();
        
        console.log(chalk.blue.bold('\n🤖 Available AI Models'));
        console.log(chalk.gray('─'.repeat(80)));

        providers.forEach(provider => {
            console.log(chalk.cyan.bold(`\n${provider}:`));
            const models = llmManager.getModelsForProvider(provider);
            
            Object.entries(models).forEach(([id, model]) => {
                const costColor = {
                    'free': chalk.green,
                    'low': chalk.yellow,
                    'medium': chalk.orange,
                    'high': chalk.red
                }[model.cost] || chalk.white;

                const speedColor = {
                    'very-fast': chalk.green,
                    'fast': chalk.blue,
                    'medium': chalk.yellow,
                    'slow': chalk.red
                }[model.speed] || chalk.white;

                console.log(`  ${chalk.white(model.name)}`);
                console.log(`    Cost: ${costColor(model.cost)} | Speed: ${speedColor(model.speed)}`);
                console.log(`    Capabilities: ${model.capabilities.join(', ')}`);
                console.log(chalk.gray(`    ${model.description}`));
            });
        });

        console.log(chalk.gray('\n─'.repeat(80)));
        
        const stats = llmManager.getModelStats();
        console.log(chalk.blue(`\nTotal Models: ${stats.totalModels}`));
        console.log(chalk.blue(`Providers: ${Object.keys(stats.byProvider).join(', ')}`));
        
        console.log(chalk.gray('\nPress Enter to continue...'));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
    }

    async viewCurrentConfig(llmManager) {
        const config = llmManager.getTeamConfiguration();
        const defaultModel = llmManager.findModelById(config.defaultModel);

        console.log(chalk.blue.bold('\n⚙️  Current LLM Configuration'));
        console.log(chalk.gray('─'.repeat(50)));
        console.log(`Default Model: ${chalk.cyan(defaultModel?.name || 'Unknown')} (${defaultModel?.provider})`);
        
        if (Object.keys(config.specializationModels).length > 0) {
            console.log(chalk.blue.bold('\nSpecialization Models:'));
            Object.entries(config.specializationModels).forEach(([spec, modelId]) => {
                const model = llmManager.findModelById(modelId);
                console.log(`  ${spec}: ${chalk.cyan(model?.name || 'Unknown')} (${model?.provider})`);
            });
        } else {
            console.log(chalk.gray('\nNo specialization-specific models configured (all use default)'));
        }

        const validation = llmManager.validateConfiguration();
        if (validation.isValid) {
            console.log(chalk.green('\n✅ Configuration is valid'));
        } else {
            console.log(chalk.red('\n❌ Configuration issues:'));
            validation.issues.forEach(issue => console.log(chalk.red(`  • ${issue}`)));
        }

        console.log(chalk.gray('\nPress Enter to continue...'));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
    }

    async showModelRecommendations(llmManager) {
        console.log(chalk.blue.bold('\n💡 Model Recommendations'));
        console.log(chalk.gray('─'.repeat(50)));

        const recommendations = [
            { task: 'Complex Frontend Development', model: llmManager.getOptimalModelForTask('frontend', 'complex') },
            { task: 'Backend API Development', model: llmManager.getOptimalModelForTask('backend', 'medium') },
            { task: 'DevOps and Infrastructure', model: llmManager.getOptimalModelForTask('devops', 'complex') },
            { task: 'Testing and QA', model: llmManager.getOptimalModelForTask('testing', 'medium') },
            { task: 'Code Optimization', model: llmManager.getOptimalModelForTask('optimization', 'complex') },
            { task: 'Bug Fixing', model: llmManager.getOptimalModelForTask('debugging', 'medium') }
        ];

        recommendations.forEach(rec => {
            const model = llmManager.findModelById(rec.model);
            if (model) {
                console.log(`${chalk.yellow(rec.task)}: ${chalk.cyan(model.name)} (${model.provider})`);
                console.log(chalk.gray(`  Reason: ${model.description}`));
            }
        });

        console.log(chalk.blue.bold('\n💰 Cost-Effective Options:'));
        const lowCostModels = llmManager.getAllModels().filter(m => m.cost === 'low' || m.cost === 'free');
        lowCostModels.forEach(model => {
            console.log(`  ${chalk.green(model.name)} (${model.provider}) - ${model.cost} cost`);
        });

        console.log(chalk.gray('\nPress Enter to continue...'));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: '' }]);
    }

    async resetLLMConfig(llmManager) {
        const { confirm } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to reset all LLM configurations to defaults?',
                default: false
            }
        ]);

        if (confirm) {
            llmManager.resetToDefaults();
            console.log(chalk.green('✅ LLM configuration reset to defaults'));
        }
    }

    async stopDevelopment(manager) {
        const spinner = ora('Stopping all AI developers...').start();
        await manager.stopDevelopment();
        spinner.succeed(chalk.green('✅ All developers stopped'));
    }
}