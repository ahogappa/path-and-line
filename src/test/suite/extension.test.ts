import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	let testDocument: vscode.TextDocument;
	let testEditor: vscode.TextEditor;

	setup(async () => {
		// Create a test document with multiple lines
		testDocument = await vscode.workspace.openTextDocument({
			content: 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6\nline 7\nline 8\nline 9\nline 10',
			language: 'plaintext'
		});
		testEditor = await vscode.window.showTextDocument(testDocument);
	});

	teardown(async () => {
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
	});

	test('Single line selection copies path:line format', async () => {
		// Select line 3 (0-indexed: line 2)
		const selection = new vscode.Selection(2, 0, 2, 6);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':3'), `Expected clipboard to end with ':3', got '${clipboardContent}'`);
	});

	test('Cursor position without selection copies path:line format', async () => {
		// Just place cursor at line 5 (0-indexed: line 4)
		const position = new vscode.Position(4, 0);
		testEditor.selection = new vscode.Selection(position, position);

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':5'), `Expected clipboard to end with ':5', got '${clipboardContent}'`);
	});

	test('Multiple line selection copies path:startLine-endLine format', async () => {
		// Select from line 2 to line 5 (0-indexed: 1 to 4)
		const selection = new vscode.Selection(1, 0, 4, 6);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':2-5'), `Expected clipboard to end with ':2-5', got '${clipboardContent}'`);
	});

	test('Selection from bottom to top copies correct range', async () => {
		// Select from line 7 to line 3 (reversed selection, 0-indexed: 6 to 2)
		const selection = new vscode.Selection(6, 0, 2, 0);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		// Selection.start is always the earlier position, so it should be 3-7
		assert.ok(clipboardContent.endsWith(':3-7'), `Expected clipboard to end with ':3-7', got '${clipboardContent}'`);
	});

	test('First line selection copies path:1 format', async () => {
		// Select line 1 (0-indexed: line 0)
		const selection = new vscode.Selection(0, 0, 0, 6);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':1'), `Expected clipboard to end with ':1', got '${clipboardContent}'`);
	});

	test('Last line selection copies correct line number', async () => {
		// Select line 10 (0-indexed: line 9)
		const selection = new vscode.Selection(9, 0, 9, 7);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':10'), `Expected clipboard to end with ':10', got '${clipboardContent}'`);
	});

	test('Full document selection copies path:1-10 format', async () => {
		// Select entire document (lines 1-10)
		const selection = new vscode.Selection(0, 0, 9, 7);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':1-10'), `Expected clipboard to end with ':1-10', got '${clipboardContent}'`);
	});

	test('Adjacent lines selection copies path:startLine-endLine format', async () => {
		// Select lines 4-5 (0-indexed: 3 to 4)
		const selection = new vscode.Selection(3, 0, 4, 6);
		testEditor.selection = selection;

		await vscode.commands.executeCommand('path-and-line.invoke');

		const clipboardContent = await vscode.env.clipboard.readText();
		assert.ok(clipboardContent.endsWith(':4-5'), `Expected clipboard to end with ':4-5', got '${clipboardContent}'`);
	});
});
