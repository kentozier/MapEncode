// Main functions

// Encodes an input string using characters of inMap
function MapEncode(inString, inMap)
{
	var args		= MapPrepEncodeArgs(inString, inMap);
	var rmax		= args.runs.length - 1;
	var result		= '';
	
	for (var i = 0; i < args.runs.length; i++)
	{
		run			= args.runs[i];
		
		if (run.charCodeAt(0) < 256)
		{
			result	+= MapEncodeOneByte(run, args.map, args.base);
			
			// add flag if appropriate
			if (i < rmax) result += args.flag;
		}
		else
		{
			result	+= MapEncodeTwoByte(run, args.map, args.base);
			
			// add flag
			result	+= args.flag;
		}
	}
	
	return result;
}

// Decodes a previously encoded string using characters of inMap
function MapDecode(inString, inMap)
{
	var args		= MapPrepDecodeArgs(inString, inMap);
	var toggle		= args.toggle;
	var result		= '';
	
	for (var i = args.runs.length - 1; i > -1; i--)
	{
		if (toggle > 0)
		{
			result	= MapDecodeTwoByte(args.runs[i], args.map, args.base) + result;
			toggle	= -toggle;
		}
		else
		{
			result	= MapDecodeOneByte(args.runs[i], args.map, args.base) + result;
			toggle	= -toggle;
		}
	}
		
	return result;
}

// Helper functions (do not use directly)

// encodes a string of two byte characters
function MapEncodeTwoByte(inRun, inMap, inBase)
{
	var carry		= 0;
	var maxRem		= inBase - 1;
	var result		= '';
	var code;
	var rem;
	
	for (var i = 0; i < inRun.length; i++)
	{
		code	= inRun.charCodeAt(i) + carry;
				
		if (code > maxRem)
		{
			while (code > maxRem)
			{
				rem		= code % inBase;
				code	= (code - rem) / inBase;
				result += inMap[rem];
			}
		
			carry	= code << 16;
		}
		else
			carry	= code << 16;
	}
	
	result += inMap[code];
	
	return result;
}

// encodes a string of one byte characters
function MapEncodeOneByte(inRun, inMap, inBase)
{
	var carry		= 0;
	var maxRem		= inBase - 1;
	var result		= '';
	var code;
	var rem;
	
	for (var i = 0; i < inRun.length; i++)
	{
		code	= inRun.charCodeAt(i) + carry;
				
		if (code > maxRem)
		{
			while (code > maxRem)
			{
				rem		= code % inBase;
				code	= (code - rem) / inBase;
				result += inMap[rem];
			}
		
			carry	= code << 8;
		}
		else
			carry	= code << 8;
	}
	
	result += inMap[code];
		
	return result;
}

// decodes a string of two byte characters
function MapDecodeTwoByte(inRun, inMap, inBase)
{
	var FCC			= String.fromCharCode;
	
	if (inRun.length == 1)
	{
		return FCC(inMap[inRun.charCodeAt(0)]);
	}
	else
	{
		var rmax		= inBase - 1;
		var start		= inRun.length - 1;
		var code		= inMap[inRun.charCodeAt(start--)] * inBase + inMap[inRun.charCodeAt(start--)];
		var result		= '';
	
		for (var i = start; i > 0; i--)
		{
			if (code > 65535)
			{
				result	= FCC(code - (code & 0xFF0000)) + result;
				code	= (code & 0xFF0000) >>> 16;
			}
		
			code	= code * inBase + inMap[inRun.charCodeAt(i)];
		}
		
		if (code > 65535)
		{
			result	= FCC(code - (code & 0xFF0000)) + result;
			code	= (code & 0xFF0000) >>> 16;
		}
	
		if (i == 0)
		{
			code		= code * inBase + inMap[inRun.charCodeAt(i)];
			result		= FCC(code - (code & 0xFF0000)) + result;
			code		= (code & 0xFF0000) >>> 16;
			
			if (code > 0)
				result	= FCC(code) + result;
		}
		else
		{
			// this only happens for i character strings
			result		= FCC(code) + result;
		}	
		
		return result;
	}
}

// decodes a string of one byte characters
function MapDecodeOneByte(inRun, inMap, inBase)
{
	var FCC			= String.fromCharCode;
		
	if (inRun.length == 1)
	{
		return FCC(inMap[inRun.charCodeAt(0)]);
	}
	else
	{
		var rmax		= inBase - 1;
		var start		= inRun.length - 1;
		var code		= inMap[inRun.charCodeAt(start--)] * inBase + inMap[inRun.charCodeAt(start--)];
		var result		= '';
	
		for (var i = start; i > 0; i--)
		{
			if (code > 255)
			{
				result	= FCC(code - (code & 0xFF00)) + result;
				code	= (code & 0xFF00) >>> 8;
			}
		
			code	= code * inBase + inMap[inRun.charCodeAt(i)];
		}
	
		if (code > 255)
		{
			result	= FCC(code - (code & 0xFF00)) + result;
			code	= (code & 0xFF00) >>> 8;
		}
	
		if (i == 0)
		{
			code		= code * inBase + inMap[inRun.charCodeAt(i)];
			result		= FCC(code - (code & 0xFF00)) + result;
			code		= (code & 0xFF00) >>> 8;
			
			if (code > 0)
				result	= FCC(code) + result;
		}
		else
		{
			// this only happens for i character strings
			if (code > 0)
				result		= FCC(code) + result;
		}
		
		return result;
	}
}


// Prepares input for encoding function
function MapPrepEncodeArgs(inString, inMap)
{
	var map			= inMap.split('');
	var flag		= map.pop();
	var base		= map.length;
	var toggle		= (inString.charCodeAt(0) > 255) ? 1 : -1 ;
	var runs		= [];
	var str			= '';
	var len			= inString.length;
	var lastSize	= (toggle > 0) ? 2 : 1 ;
	var code;
	var FCP			= String.fromCodePoint;
	var result		= {	base: base,
						toggle: toggle,
						flag: flag,
						map: map,
						runs: runs};
	
	// split inString into runs of 1 or two byte characters
	for (var i = 0; i < len; i++)
	{
		code		= inString.charCodeAt(i);
		
		if (code > 255)
		{
			if (lastSize == 2)
				str	+= FCP(code);
			else
			{
				runs.push(str);
				str	= FCP(code);
				lastSize	= 2;
			}
		}
		else
		{
			if (lastSize == 1)
				str	+= FCP(code);
			else
			{
				runs.push(str);
				str	= FCP(code);
				lastSize	= 1;
			}
		}
	}
	
	if (str.length > 0)
		runs.push(str);
		
	return result;
}

// Prepares input for decoding function
function MapPrepDecodeArgs(inString, inMap)
{
	var imap		= inMap.split('');
	var flag		= imap.pop();
	var len			= imap.length;
	var toggle		= (inString.charAt(inString.length - 1) == flag) ? 1 : -1 ;
	var rmap		= [];
	var result		= {	base: len,
						toggle: toggle,
						flag: flag,
						map: rmap};
	var runs		= inString.split(flag);
	
	if (runs[runs.length - 1] == '')
		runs.pop();
		
	result.runs		= runs;
	
	// generate the decode char map					
	for (var i = 0; i < len; i++)
	{
		rmap[inMap.charCodeAt(i)]	= i;
	}
	
	return result;
}

