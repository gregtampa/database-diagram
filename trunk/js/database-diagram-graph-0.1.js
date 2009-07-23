// degrees to radians, because most people think in degrees
function degToRad(angle_degrees)
{
   return angle_degrees/180*Math.PI;
}

// draw the head of an arrow (not the main line)
//  ctx: canvas context
//  x,y: coords of arrow point
//  angle_from_north_clockwise: angle of the line of the arrow from horizontal
//  upside: true=above the horizontal, false=below
//  barb_angle: angle between barb and line of the arrow
//  filled: fill the triangle? (true or false)
function drawArrowHead(ctx, x, y, angle_from_horizontal_degrees, upside, //mandatory
						barb_length, barb_angle_degrees, filled)          //optional
{
	if(barb_length==undefined) { barb_length=13; }
	if(barb_angle_degrees==undefined) { barb_angle_degrees = 20; }
	if(filled==undefined) { filled=true; }
	if(upside) { alpha = -angle_from_horizontal_degrees; }
	else { alpha = angle_from_horizontal_degrees; }

	//first point is end of one barb
	a = x + (barb_length * Math.cos(degToRad(alpha - barb_angle_degrees)));
	b = y + (barb_length * Math.sin(degToRad(alpha - barb_angle_degrees)));

	//final point is end of the second barb
	c = x + (barb_length * Math.cos(degToRad(alpha + barb_angle_degrees)));
	d = y + (barb_length * Math.sin(degToRad(alpha + barb_angle_degrees)));
	

	ctx.beginPath();
	ctx.moveTo(a,b);
	ctx.lineTo(x,y);
	ctx.lineTo(c,d);
	if(filled) { ctx.fill(); }
	else { ctx.stroke(); }
	return true;
}

function drawArrow(ctx, x, y, x2, y2)
{
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
	//soh cah toa
	var angle = Math.atan2(x - x2, y - y2);
	drawArrowHead(ctx, x2, y2, (angle*180/Math.PI)-90, true);
}
	
function distance(a, b, x, y)
{
	var dx = a-x;
	var dy = b-y;
	return Math.sqrt( dx * dx + dy * dy );
}

function joinItems(ctx, from_left, from_right, from_y, to_left, to_right, to_y)
{
	var left_left =		distance(from_left, from_y, to_left, to_y);
	var left_right =	distance(from_left, from_y, to_right, to_y);
	var right_left =	distance(from_right, from_y, to_left, to_y);
	var right_right =	distance(from_right, from_y, to_right, to_y);
	var min = Math.min(left_left, left_right, right_left, right_right);
	
	if( left_left == min)
		drawArrow(ctx, from_left, from_y, to_left, to_y);
	
	if( left_right == min)
		drawArrow(ctx, from_left, from_y, to_right, to_y);

	if( right_left == min)
		drawArrow(ctx, from_right, from_y, to_left, to_y);
		
	if( right_right == min)
		drawArrow(ctx, from_right, from_y, to_right, to_y);
}

function updateCanvas(canvasJq, tables)
{
	var canvasEl = canvasJq[0];
	canvasEl.width=canvasJq.width();
	canvasEl.height=canvasJq.height();
	var cOffset = canvasJq.offset();
	var ctx = canvasEl.getContext("2d");
	ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	
	$(tables).each(function(){
		$("li", this).each(function(){
			var li=$(this);
			if(li.attr("rel"))
			{
				var srcOffset=li.offset();
				var srcMidHeight=li.height()/2;
				var targetLi=$("#"+li.attr("rel"));
				if(targetLi.length)
				{
					var trgOffset=targetLi.offset();
					var trgMidHeight=li.height()/2;
					
					joinItems(ctx,
						srcOffset.left - cOffset.left,
						srcOffset.left - cOffset.left + li.outerWidth(),
						srcOffset.top - cOffset.top + srcMidHeight,
						trgOffset.left - cOffset.left,
						trgOffset.left - cOffset.left + targetLi.outerWidth(),
						trgOffset.top - cOffset.top + trgMidHeight );
				}
			}
		});
	});
}