import Color = require('color');
import { generateKeyPair } from 'crypto';
import * as vscode from 'vscode';
import { getNamedColors, getTemplateVariable, render } from './base10';
import * as fs from 'fs';
import * as path from 'path';
import _ from 'lodash';
import yaml from 'yaml';

const PALETTE = 'base10.palette';
const themeFile: string = path.resolve(__dirname, '../themes/base10.json');
const templateFile: string = path.resolve(__dirname, '../themes/base10.mustache.json');
const semanticFile: string = path.resolve(__dirname, '../src/semantic.yaml');



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("activate");
	fs.watchFile(templateFile, {interval: 800}, (e, n) => {
		console.log("template changed");
		generateTheme();
	});
	fs.watchFile(semanticFile, {interval: 800}, (e, n) => {
		console.log("semantic changed");
		generateTheme();
	});
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
		if (e.affectsConfiguration(PALETTE)) {
			generateTheme();
		}
	}));

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let generate = vscode.commands.registerCommand('base10-vscode.generate', () => {
		// showInformationMessage('Hello World!');
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		generateTheme();
	});

	context.subscriptions.push(generate);
}

// this method is called when your extension is deactivated
export function deactivate() {}

async function generateTheme(palette?: string): Promise<void> {
	if(palette === undefined) {
			palette = vscode.workspace.getConfiguration().get(PALETTE) as string;
	}

	const template = fs.readFileSync(templateFile, {encoding: 'utf8'});
	const semantic = fs.readFileSync(semanticFile, {encoding: 'utf8'});

	const cs = _.map(palette.split("-"), c => Color("#"+c));
	const semanticObj = yaml.parse(semantic) as { [k: string]: string };
	const output = render(template, cs, semanticObj);

	fs.writeFileSync(themeFile, output);

	await promptRestart("Please Restart.");
}

async function promptRestart(informationMessage: string): Promise<void> {
    let reloadAction: vscode.MessageItem = {title: 'Reload Now'};
    let selectedAction = await vscode.window.showInformationMessage(informationMessage, reloadAction);
    if (!selectedAction) {
        return;
    }
    if (selectedAction.title == reloadAction.title) {
        await vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
}
