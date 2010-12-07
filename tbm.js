/**
 * 	Tunnel Boring Machine!
 *
 * 	Author: Frederic Barthelemy minecraft@fbartho.com
 * 	Date Created: 2010-11-22
 *
 */
function fb_parseInt(s) {
	return parseInt(s,10);
}

var tbm_borers = {
	playerToBorer:{},
	borerToPlayer:{},
	totalUses:0
};

function TunnelBoringMachine(p,x,y,z,rotation,iWidth,iHeight) {
	this.player = p;
	
	this.x = x;
	this.y = y;
	this.z = z;
	this.r = rotation;
	
	this.i = 0;
	
	this.iWidth = iWidth;
	this.iHeight = iHeight;
	
	this.running = true;
	
	tbm_borers.playerToBorer[this.player.id] = this;
	tbm_borers.borerToPlayer[this] = this.player.id;
	tbm_borers.totalUses++;
	
	this.player.sendMessage(Color.Yellow + "TBM: Starting Tunnel Bore");
	this.boreLevels();
}

function tbm_isLooseBlock(type) {
	if (   type == Blocks.Air 
		|| type == Blocks.Water
		|| type == Blocks["Stationary water"]
		|| type == Blocks.Lava
		|| type == Blocks["Stationary lava"]
		|| type == Blocks.Gravel
		|| type == Blocks.Sand
		|| type == Blocks["Slow Sand"]
		|| type == Blocks.Snow
		|| type == Blocks.Ice) {
		return true;
	}
	return false;
}
function tbm_isOreBlock(type) {
	return ItemIds[type].indexOf("ore") != -1;
}
function tbm_isOreOrLoose(type) {
	return tbm_isLooseBlock(type) || tbm_isOreBlock(type);
}


TunnelBoringMachine.prototype = {
	stop:function() {
//		delete tbm_borers.playersToBorers[this.player.id];
//		delete tbm_borers.borersToBlayers[this];
		this.running = false;
		this.player.sendMessage(Color.Yellow + "TBM: stopping.");
	},
	boreLevels:function() {
		if(!this.running) {
			return;
		}
		
		if(this.i > 500) {
			this.stop();
			this.player.sendMessage(Color.Yellow + "TBM: Reached Server Fail Safe of 500 meters.");
			return;
		}
		
		this.player.sendMessage(Color.Yellow + "TBM: boring levels");
		
		var numLevelsPerCycle = 3;
		var stopI = this.i + numLevelsPerCycle;
		
		for(;this.i < stopI; this.i++) {
			this.boreOneLevel();
		}
		
		var tbm = this;
		if(this.running){
			setTimeout(function(){
				tbm.boreLevels();
			},1000);
		}
	},
	boreOneLevel:function()
	{
		var cx, cy, cz,cpoint,material,topblock,
			leftblock,rightblock,bottomblock,
			rightglass = false,leftglass = false;
		var bb = new BlockBuilder();
		
		// A. Dig out one level past the current block in the cavity, and replace with glass.
		for (var iz = 0 + Math.floor(-this.iWidth/2.0); iz < 2 + Math.floor(this.iWidth/2.0); iz++)
		{
			for (var iy = 0 + Math.floor(-this.iHeight/2.0); iy < 2 + Math.floor(this.iHeight/2.0); iy++)
			{
				bb.add(Blocks.Glass,1+this.i,iy,iz);
			}
		}
		
		// B. Build the Stone/Glass Surrounding Wall
		// - floor first
		cy = (-1-Math.floor(this.iHeight/2.0));
		for (var iz = 1 + Math.floor(-this.iWidth/2.0); iz < 1 + Math.floor(this.iWidth/2.0); iz++) {
			bb.add(Blocks.Stone,this.i,cy,iz);
		}
		// - corners
		// -- topleft
		cx = this.i;
		cy = 1 + Math.floor(this.iHeight/2.0);
		cz = 0 + Math.floor(-this.iWidth/2.0);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy+1,cz);
		topblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy,cz-1);
		leftblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		if (tbm_isOreOrLoose(topblock) ||tbm_isOreOrLoose(leftblock) ) 
		{
			material = Blocks.Glass;
		}
		else 
		{
			material = Blocks.Stone;
		}
		bb.add(material,cx,cy,cz);
		
	
		// -- topright
		cx = this.i;
		cy = 1 + Math.floor(this.iHeight/2.0);
		cz = 1 + Math.floor(this.iWidth/2.0);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy+1,cz);
		topblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy,cz+1);
		rightblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		if (tbm_isOreOrLoose(topblock) ||tbm_isOreOrLoose(rightblock) ) 
		{
			material = Blocks.Glass;
		}
		else 
		{
			material = Blocks.Stone;
		}
		bb.add(material,cx,cy,cz);
		
		// -- bottomleft
		cx = this.i;
		cy = -1 - Math.floor(this.iHeight/2.0);
		cz = 0 + Math.floor(-this.iWidth/2.0);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy-1,cz);
		bottomblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy,cz-1);
		leftblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		if (tbm_isOreOrLoose(bottomblock) ||tbm_isOreOrLoose(leftblock) ) 
		{
			material = Blocks.Glass;
		}
		else 
		{
			material = Blocks.Stone;
		}
		bb.add(material,cx,cy,cz);
		
		// -- bottomright
		cx = this.i;
		cy = -1 - Math.floor(this.iHeight/2.0);
		cz = 1 + Math.floor(this.iWidth/2.0);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy-1,cz);
		bottomblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy,cz+1);
		rightblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
		
		if (tbm_isOreOrLoose(topblock) ||tbm_isOreOrLoose(rightblock) ) 
		{
			material = Blocks.Glass;
		}
		else 
		{
			material = Blocks.Stone;
		}
		bb.add(material,cx,cy,cz);
		
		// - sidewalls
		// -- left
		cx = this.i;
		cz = 0 + Math.floor(-this.iWidth/2.0);	
		for (var iy = 1 + Math.floor(-this.iHeight/2.0); iy < 1 + Math.floor(this.iHeight/2.0); iy++)
		{
			cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,iy,cz-1);
			leftblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
			
			if (tbm_isOreOrLoose(leftblock) ) 
			{
				leftglass = true;
				material = Blocks.Glass;
			}
			else 
			{
				material = Blocks.Stone;
			}
			bb.add(material,cx,iy,cz);
		}
		// -- right
		cx = this.i;
		cz = 1 + Math.floor(this.iWidth/2.0);
		for (var iy = 1 + Math.floor(-this.iHeight/2.0); iy < 1 + Math.floor(this.iHeight/2.0); iy++)
		{
			cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,iy,cz+1);
			rightblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
			
			if (tbm_isOreOrLoose(rightblock) ) 
			{
				rightglass = true;
				material = Blocks.Glass;
			}
			else 
			{
				material = Blocks.Stone;
			}
			bb.add(material,cx,iy,cz);
		}
		
		// - roof
		cx = this.i;
		cy = 1 + Math.floor(this.iHeight/2.0);
		for (var iz = 1 + Math.floor(-this.iWidth/2.0); iz < 1 + Math.floor(this.iWidth/2.0); iz++) {
			cpoint = bb.unrotate([this.x,this.y,this.z,this.r],cx,cy+1,iz);
			topblock = Api.server.getBlockIdAt(cpoint[0],cpoint[1],cpoint[2]);
			//this.player.sendMessage("RoofBlockType: "+ItemIds[topblock]);
			if (tbm_isOreOrLoose(topblock) ) 
			{
				material = Blocks.Glass;
			}
			else 
			{
				material = Blocks.Stone;
			}
			bb.add(material,cx,cy,iz);
		}
		
		
		// C. Empty out current level
		for (var iz = 1 + Math.floor(-this.iWidth/2.0); iz < 1 + Math.floor(this.iWidth/2.0); iz++)
		{
			for (var iy = 1 + Math.floor(-this.iHeight/2.0); iy < 1 + Math.floor(this.iHeight/2.0); iy++)
			{
				bb.add(Blocks.Air,this.i,iy,iz);
			}
		}
		// D. Todo insert torches on some modulus of i
		if (this.i % 5 == 0) {
			//this.player.sendMessage(Color.Yellow + "TBM: Planting torch"+vectorToString([this.i,1+Math.floor(-this.iHeight/2.0),0]));
			//bb.add(Blocks.Torch,this.i,1 + Math.floor(-this.iHeight/2.0),0);
			
			if(leftglass){
				//Plant on ground
				bb.add(Blocks.Torch,this.i,1 + Math.floor(-this.iHeight/2.0),1 + Math.floor(-this.iWidth/2.0))
			}
			else {
				//Plant on wall
				bb.add(Blocks.Torch,this.i,0 + Math.floor(this.iHeight/2.0),1 + Math.floor(-this.iWidth/2.0))
			}
			
			if(rightglass){
				//Plant on ground
				bb.add(Blocks.Torch,this.i,1 + Math.floor(-this.iHeight/2.0),0 + Math.floor(this.iWidth/2.0))
			}
			else {
				//Plant on wall
				bb.add(Blocks.Torch,this.i,0 + Math.floor(this.iHeight/2.0),0 + Math.floor(this.iWidth/2.0))
			}
		}
		
		bb.attachTo(this.x,this.y,this.z,this.r);
	}
};

Api.onCommand(function (player, split) {
	if(split[0] == "/tbm" && player.canUseCommand("/tbm")) {
		if(tbm_borers.playerToBorer[player.id] != null) {
			tbm_borers.playerToBorer[player.id].stop();
			tbm_borers.playerToBorer[player.id] = null;
			return true;
		}
		
		var command = split[0].substring(1);
		var args = [];
		if(split.length > 1) {
			args = split.slice(1);
		}
		var printSyntax = function () {
			player.sendMessage(Color.Red + 'Syntax is /'+command+' walkspace[1-5] height[2-5]');
		};
		if(args.length < 3)
		{
			printSyntax();
		}
		var h = Api.createHitBlox(player);
		var block = h.getTargetBlock();
		var x = block.getX();
		var y = block.getY();
		var z = block.getZ();
		
		var interiorWidth = fb_parseInt(args[0]);
		var interiorHeight = fb_parseInt(args[1]);
		
		if (isNaN(interiorWidth) || interiorWidth < 1 || interiorWidth > 5) {
			player.sendMessage(Color.Red +'Width out of range [1-5], using default [5]');
			interiorWidth = 5;
		}
		if (isNaN(interiorHeight) || interiorHeight < 2 || interiorHeight > 5) {
			player.sendMessage(Color.Red +'Height out of range [2-5], using default [3]');
			interiorHeight = 3;
		}
		
		new TunnelBoringMachine(player,x,y,z,player.getRotation(),interiorWidth,interiorHeight);
		return true;
 	}
 });
 