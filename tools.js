//function fb_parseInt(s) {
//	return parseInt(s,10);
//}
function printOneAPI(key,obj) {
	Api.log.info(key);
	for(var t in obj) {
		Api.log.info("\t"+t);
	}
}
function printAPIs() {
	printOneAPI("Api.etc",Api.etc);
	printOneAPI("Server",Api.server);
	printOneAPI("mcServer",Api.mcServer);
	printOneAPI("BlockBuilder",new BlockBuilder());
}
function fb_parseInt(s) {
	return parseInt(s,10);
}

Api.onCommand(function (player, split) {
	if(split[0] == "/tunnel" && player.canUseCommand("/tunnel")) {
		var command = split[0].substring(1);
		var args = [];
		if(split.length > 1) {
			args = split.slice(1);
		}
		var printSyntax = function () {
			player.sendMessage(Color.Red + 'Syntax is /'+command+' width height length');
		};
		if(args.length < 3)
		{
			printSyntax();
			return true;
		}
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		var x = block.getX();
		var y = block.getY();
		var z = block.getZ();
		
		var bb = new BlockBuilder();
		
		var width = fb_parseInt(args[0]);
		var height = fb_parseInt(args[1]);
		var length = fb_parseInt(args[2]);
		
		bb.addPrism(0, [0, 1 + Math.floor(-height/2.0), 0-Math.floor(width/2.0)], length, width, height);
		
		// attach it to the world where the user is pointing, but one block higher so it 
		// is build above ground. player.getRotation() is passed so the structure is built
		// in the correct direction relative to the player. This makes it so that in 
		// BlockBuilder, the x axis is always going straight away from the player and the
		// z axis is always perpendicular to the player.
		bb.attachTo(x, y, z, player.getRotation());
		return true;
	}
});
Api.onCommand(function (player, split) {
	if(split[0] == "/flatten" && player.canUseCommand("/flatten")) {
		var command = split[0].substring(1);
		var args = [];
		if(split.length > 1) {
			args = split.slice(1);
		}
		var printSyntax = function () {
			player.sendMessage(Color.Red + 'Syntax is /'+command+'<voffset> <height> <width> <length>');
		};
		if(args.length > 4)
		{
			printSyntax();
			return true;
		}
		//var h = Api.createHitBlox(player);
		//var block = h.getTargetBlock();
		var x = player.getX();
		var y = player.getY();
		var z = player.getZ();
		
		var bb = new BlockBuilder();
		
		var voffset = fb_parseInt(args[0]);
		var height = fb_parseInt(args[1]);
		var width = fb_parseInt(args[2]);
		var length = fb_parseInt(args[3]);
		if(isNaN(voffset))voffset = 0;
		if(isNaN(height))height = 30;
		if(isNaN(width))width = 30;
		if(isNaN(length))length = 30;
		
		bb.addPrism(0, [0 - Math.floor(length/2.0), 0 + voffset, 0-Math.floor(width/2.0)], length, width, height);
		
		// attach it to the world where the user is pointing, but one block higher so it 
		// is build above ground. player.getRotation() is passed so the structure is built
		// in the correct direction relative to the player. This makes it so that in 
		// BlockBuilder, the x axis is always going straight away from the player and the
		// z axis is always perpendicular to the player.
		bb.attachTo(x, y, z, player.getRotation());
		Api.log.info("Flatten Complete");
		player.sendMessage(Color.Yellow + "Flatten Complete");
		return true;
	}
});
BlockBuilder.prototype.unrotate = function(origin,x,y,z) {
	var rot = origin[3];
	var ox = origin[0];
	var oy = origin[1];
	var oz = origin[2];
	
	var dir = Api.rotationToAxis(rot);
	
	var doX, doZ;
	if(dir == "x-") {			
		doX = true;
		doZ = true;
	} else if (dir == "x+") {
		doX = false;
		doZ = false;
	} else if (dir == "z-") {
		doX = false;
		doZ = true;
	} else if (dir == "z+") {
		doX = true;
		doZ = false;
	}
	
	if(doX && doZ)
		return [ox - x, oy + y, oz - z];
	else if(!doX && !doZ)
		return [ox + x, oy + y, oz + z];
	else if(!doX && doZ)
		return [ox + z, oy + y, oz - x];
	else if(doX && !doZ)
		return [ox - z, oy + y, oz + x];
}
function vectorAdd(v1,v2) {
	return [v1[0]+v2[0],v1[1]+v2[1],v1[2]+v2[2]];
}
function vectorToString(v) {
	return "["+v[0]+","+v[1]+","+v[2]+"]";
}
function normalize(v) {
	return [Math.floor(v[0]),Math.floor(v[1]),Math.floor(v[2])];
}

