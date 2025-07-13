#!/usr/bin/env node

import { DevTeamManager } from './DevTeamManager.js';
import { CLI } from './CLI.js';

async function main() {
    const cli = new CLI();
    const manager = new DevTeamManager();
    
    try {
        await cli.start(manager);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();