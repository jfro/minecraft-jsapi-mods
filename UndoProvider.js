//////////////////////////////////////////////////////////////////////////////
/** 
 *  @date:      2010-12-07
 *  @file:      UndoProvider.js
 *  @author:    Frederic Barthelemy		minecraft@fbartho.com
 *  Website:    http://www.fbartho.com/
 *  Copyright:  2010 
 *	License:	<determination in progress>
 * 
 *  @brief: 	Provides Undo functionality at a couple granularity levels.
 */
//////////////////////////////////////////////////////////////////////////////
var UndoProvider;

/**
 * Usage: 
 * 		Users type /undo ls to see a list of stored undoable actions
 *		Users type /undo <undoActionKey> to undo a whole particular action
 *		Users type /undo <undoActionKey> (--step or -s) <numberOfSteps>
 *
 * Tools that wish to use it will be able to access UndoProvider.pushUndo(...)
 */
 If they give a unique key, then the user will be able 

Api.onCommand(function (player, split) {
	if(split[0] == "/undo" && player.canUseCommand("/undo")) {
		var command = split[0].substring(1); 

		if(split.length > 1) {
			split = split.slice(1);
		}
		
		var args = argsParse( split ) || {};
		
		UndoProvider.execute(player,args);
		
		return true;
	}
});

//TODO: think about upperlimits for the memory usage, autopurging of the undo stacks.

function UndoPiece(numBlocks,blocksArr){
	this.timestamp = new Date();
}

function UndoProviderSingleton() {
	this.undostack = {};
}
UndoProviderSingleton.prototype = {
	execute:function(player,args) {
		if(args["ls"]) {
			this.listUndos(player);
		}
		
		if(args["help"]) {
			this.printHelp(player);
		}
	},
	printHelp:function(player) {
		player.sendMessage(Color.Red + "Usage for Undo: *\n"
		 +"* Usage:\n"
		 +"* 		Users type /undo ls to see a list of stored undoable actions\n"
		 +"*		Users type /undo <undoActionKey> to undo a whole particular action\n"
		 +"*		Users type /undo <undoActionKey> (--step or -s) <numberOfSteps>\n"
		 +"*\n"
		 +"* Tools that wish to use it will be able to access UndoProvider.pushUndo(...)\n"
		 +"UndoProvider is UNDERCONSTRUCTION.");
	},
	pushUndo:function(player,actionKey,/*UndoPiece*/undoStep) {
	},
	listUndos:function(player) {
	},
	undoPlayer:function(player) {
	},
	undoSubPiece:function(player,actionKey,numberOfUndos) {
	},
	undoWholeAction:function(player,actionKey) {
	},
	undoAll:function(){
	},
	dumpUndoStore:function() {
	}
};

UndoProvider = new UndoProviderSingleton();
