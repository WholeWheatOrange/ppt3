
var modal = document.getElementById('modal')
var modalContent = document.getElementById('modal-content')
var controlsContainer = document.getElementById('controls-container')
var selected
var controls = localStorage.getItem("controls")

var defaultControls = {
    "move_left": [37, "ArrowLeft"],
    "move_right": [39, "ArrowRight"],
    "rotate_left": [83, "s"],
    "rotate_right": [38, "ArrowUp"],
    "rotate_180": [88, "x"],
    "softdrop": [40, "ArrowDown"],
    "harddrop": [32, "Spacebar"],
    "hold": [67, "c"],
    "restart": [115, "F4"],
    "DAS": 100,
    "ARR": 0,
    "grav_ARR": 0
}

if (controls === null) {
    controls = defaultControls
} else {
    controls = {...defaultControls, ...JSON.parse(controls) }
}

    localStorage.setItem('controls', JSON.stringify(controls));
console.log(controls)

var inputs = controlsContainer.getElementsByClassName('input-button')
for (let i = 0; i < inputs.length; i++) {
    const element = inputs[i];
    element.textContent = controls[element.id][1]
}

function openModal() {
    console.log('open')
    modal.style.display = 'block';
    modalContent.style.display = 'block';
    document.onkeydown = (e) => {
        if (selected != null) {
            
        e.preventDefault();
            controls[selected.id] = [e.keyCode, e.key]
            if (e.keyCode == 32) {
                controls[selected.id][1] = 'Spacebar'
            }
            selected.textContent = controls[selected.id][1]
            selected = null
        }
    };
}

function closeModal() {
    console.log('close')
    modal.style.display = 'none';
    modalContent.style.display = 'none';
    document.onkeydown = null
}

function saveControls() {
    var numInputs = document.getElementsByTagName("input")
    for (var i = 0; i < numInputs.length; i++) {
        controls[numInputs[i].id] = numInputs[i].value
    }
    
    localStorage.setItem('controls', JSON.stringify(controls));
}

function select(ele) {
    if (selected != null) {
        selected.textContent = controls[selected.id][1]
    }
    if (selected === ele) {
        selected.textContent = controls[selected.id][1]
        selected = null;
    } else {
        ele.textContent = 'Press Any Key.'
        selected = ele
    }
}
