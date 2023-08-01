//Functions to return the row, column and zone from a given index from 0 to 81
function getrow(index){return Math.floor(index/9)}
function getcol(index){return index%9}
function getzone(index){return (3*Math.floor(getrow(index)/3) + Math.floor(getcol(index)/3))}



//create grid
const grid = document.getElementById("grid");

for (let i = 0; i < 81; i++) {
	var cell = document.createElement("INPUT");
    //cell.id = "cell"+i
    cell.cellindex = i
    cell.classList.add("cell")
    cell.type = "number";
    cell.onkeyup = function() {checknew(this,this.cellindex,this.value)};
    grid.appendChild(cell);
}

// returns boolean of whether placing here is a legal move
function checkposition(newindex, newvalue, fill){
    var thisrow = getrow(newindex)
    var thiscol = getcol(newindex)
    var thiszone = getzone(newindex);

    var cells = grid.children // list of all cells
    for (let i = 0; i < 81; i++) {
        if (i != newindex){ // for all the cells except itself
            if (thisrow == getrow(i) && newvalue==cells[i].value){return false} // if they are in the same row and same value
            if (thiscol == getcol(i) && newvalue==cells[i].value){return false} // "" checks columns
            if (thiszone == getzone(i) && newvalue==cells[i].value){return false} // "" checks zones
        }
    }
    return true
}

function checknew(which, newindex, newvalue){
    newvalue = parseInt(newvalue)
    
    if (Number.isNaN(newvalue)){
        console.log("yeah")
        which.classList.remove("invalid")
        which.classList.remove("valid")
    }

    else if (!(Number.isInteger(newvalue) && 0<=newvalue && newvalue<=9)){ // If they arent a number or are out of range it is invalid
        which.classList.add("invalid")
    }

    else{ // value can now be checked for legal position
        if (checkposition(newindex, newvalue, true)){which.classList.add("valid")}
        else {which.classList.add("invalid")}
    }
}