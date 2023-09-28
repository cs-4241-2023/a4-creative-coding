function main(){
    const canvas = document.getElementById('drawingCanvas');
    const choice = document.getElementById('coloringPage');
    const color = document.getElementById('brushColor');
    const clear = document.getElementById('clear');
    const line = document.getElementById('lineWidth');
    const context = canvas.getContext('2d');

    const offsetX = canvas.offsetLeft;
    const offsetY = canvas.offsetTop;
    canvas.width = window.innerWidth - offsetX;
    canvas.height = window.innerHeight - offsetY;

    var lineWidth = 5;
    var isDrawing = false;
    var drawX, drawY;
    
    choice.addEventListener('change', e => {
        const selected = coloringPage.value;
        var pic = new Image();
        switch(selected){
            case 'Cat':
                context.clearRect(0, 0, canvas.width, canvas.height);
                pic.src = '../svgs/cat.svg';
                context.drawImage(pic, 0, 0, pic.width, pic.height);
                break;
            case 'Space':
                context.clearRect(0, 0, canvas.width, canvas.height);
                pic.src = '../svgs/space.svg';
                context.drawImage(pic, 0, 0, pic.width, pic.height);
                break;
            case 'Sunflower':
                context.clearRect(0, 0, canvas.width, canvas.height);
                pic.src = '../svgs/sunflowers.svg';
                context.drawImage(pic, 0, 0, pic.width, pic.height);
                break;
            case 'Blank':
                context.clearRect(0, 0, canvas.width, canvas.height);
                break;
        }
    })

    color.addEventListener('change', e => {
        context.strokeStyle = e.target.value;
    })

    clear.addEventListener('click', e => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    })

    line.addEventListener('change', e => {
        lineWidth = e.target.value;
    })

    canvas.addEventListener('mousedown', e => {
        isDrawing = true;
        drawX = e.clientX - offsetX;
        drawY = e.clientY - offsetY;
    })

    const draw = (e) => {
        if(!isDrawing) {
            return;
        }
    
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
    
        context.lineTo(e.clientX - offsetX/2, e.clientY - offsetY + 10);
        context.stroke();
    }

    canvas.addEventListener('mousemove', draw);

    canvas.addEventListener('mouseup', e => {
        isDrawing = false;
        context.stroke();
        context.beginPath();
    })
}