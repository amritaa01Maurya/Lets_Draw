const canvas = document.querySelector('canvas')

const toolBtns = document.querySelectorAll('.tool');
const colorBtns = document.querySelectorAll('.colors .option');
const fillColor = document.querySelector('#fill-color');
const sizeSlider = document.querySelector('#size-slider');
const colorPicker = document.querySelector('#color-picker');
const ctx = canvas.getContext("2d");

let isDrawing = false; 
let brushSize = 1;
let selectedTool = 'brush'
let selectedColor = '#000'
let prevMouseX, prevMouseY, snapshot;

window.addEventListener("load", () => { 
    // setting canvas width/height..offsetwidth/height returns viewable width/height of an element 
    canvas.width = canvas.offsetWidth; 
    canvas.height = canvas.offsetHeight;
})

const drawRect = (e) =>{
    if(!fillColor.checked){
        ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
        return;
    }

    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    // ctx.lineWidth = brushSize;
}

const drawCircle = (e) =>{

    ctx.beginPath(); // create new path to draw circle
    // cal radius of circle according to mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2), Math.pow((prevMouseY - e.offsetY), 2))
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke()
    // ctx.lineWidth = brushSize;
}

const drawLine= (e) =>{

    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke();

}

const drawTriangle= (e) =>{
    
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 3 - e.offsetX, prevMouseY);
    ctx.closePath()
    fillColor.checked ? ctx.fill() : ctx.stroke()

}

const startDraw = (e) => { 
    isDrawing = true;
    prevMouseX = e.offsetX
    prevMouseY = e.offsetY
    ctx.beginPath() // create new path from here
    ctx.lineWidth = brushSize; // change brush size


    // eraser logic
    ctx.strokeStyle = selectedTool === 'eraser' ? '#ffffff' : selectedColor;
    ctx.fillStyle = selectedTool === 'eraser' ? '#ffffff' : selectedColor;


    // copying canvas data & passing as snapshot value..this avoids dragging the image
    snapshot = ctx.getImageData(0,0, canvas.width, canvas.height)
}

const stopDraw = () => { 
    isDrawing = false;
}


const drawing = (e) => { 
    if(!isDrawing) return; 
    // if isDrawing is false return from here 

    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on to this canvas

    if(selectedTool === 'brush'){
        ctx.lineTo(e.offsetX, e.offsetY); // creating line according to the mouse pointer 
        ctx.stroke(); // drawing/filing line with color 
    }else if(selectedTool === 'rectangle'){
        drawRect(e);
    }else if(selectedTool === 'circle'){
        drawCircle(e);
    }else if(selectedTool === 'triangle'){
        drawTriangle(e);
    }else if(selectedTool === 'line'){
        drawLine(e);
    }
}


toolBtns.forEach(btn => { 
    btn.addEventListener("click", () => { 
        // adding click event to all tool option 
        // // removing active class from the previous option and adding on current clicked option 
        document.querySelector(".tool.active").classList.remove("active"); 
        btn.classList.add("active"); 
        selectedTool = btn.id; 
        console.log(selectedTool); 
    });

});

colorBtns.forEach(btn => { 
    btn.addEventListener("click", () => { 
        document.querySelector(".color.active").classList.remove("active"); 
        btn.classList.add("active");

        if (btn.id === "color-picker") {
            selectedColor = btn.value;
        } else {
            selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        }
    })
})


colorPicker.addEventListener("input", () => { 
    // passing picked color value from color picker to last color btn background 
    selectedColor = colorPicker.value; 
    document.querySelector(".color.active")?.classList.remove("active"); 
    colorPicker.classList.add("active");

})

sizeSlider.addEventListener("change", () => brushSize = sizeSlider.value)
canvas.addEventListener("mousedown", startDraw); 
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw); 