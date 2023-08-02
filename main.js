//Functions to return the row, column and zone from a given index from 0 to 81
function getrow(index){return Math.floor(index/9)}
function getcol(index){return index%9}
function getzone(index){return (3*Math.floor(getrow(index)/3) + Math.floor(getcol(index)/3))}



//create grid 1
const grid = document.getElementById("grid");

for (let i = 0; i < 81; i++) {
	var cell = document.createElement("INPUT");

    cell.cellindex = i
    cell.classList.add("cell")
    cell.type = "number";
    cell.onkeyup = function() {checknew(this,this.cellindex,this.value)};
    grid.appendChild(cell);
}

//create grid2
const grid2 = document.getElementById("grid2")
for (let i = 0; i < 81; i++) {
	var cell = document.createElement("div");

    cell.cellindex = i
    cell.classList.add("options");
    cell.textContent = ""
    grid2.appendChild(cell);
}

// returns boolean of whether placing here is a legal move
function checkposition(newindex, newvalue){
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

// function to check whether a human entered value is valid and colours it appropriately
function checknew(which, newindex, newvalue){
    newvalue = parseInt(newvalue)
    
    if (Number.isNaN(newvalue)){
        which.classList.remove("invalid")
        which.classList.remove("known")
        which.classList.remove("found")
    }

    else if (!(Number.isInteger(newvalue) && 0<=newvalue && newvalue<=9)){ // If they arent a number or are out of range it is invalid
        which.classList.add("invalid")
    }

    else{ // value can now be checked for legal position
        if (checkposition(newindex, newvalue)){which.classList.add("known")}
        else {which.classList.add("invalid")}
    }
}

function clearAll(){
    for (let i = 0; i < 81; i++) {
        grid2.children[i].textContent = ""
        grid.children[i].value = ""
        grid.children[i].classList = ["cell"]
    }
}

function reset(){
    for (let i = 0; i < 81; i++) {
        grid2.children[i].textContent = ""
        if (! grid.children[i].classList.contains("known")) {
            grid.children[i].value = ""
            grid.children[i].classList = ["cell"]
        }
    }
}




async function delay(amount) {
    await new Promise((resolve) => setTimeout(resolve, amount));
  }

function update_possibles(possibles, safe=false){ // Function to draw possibilities to the screen and return how many are unsolved
    var remaining = 81
    for (let i = 0; i < 81; i++) {
        if (possibles == false){return -1} // if its been declared impossible by another function
        if (possibles[i].length == 0){return -1} // if it has no possible placements return the terminating value

        if (possibles[i].length == 1 && ! (grid.children[i].classList.contains("known") || grid.children[i].classList.contains("guess"))){ // if theres only one option fill it in as found
            if (!safe){ // if theres a chance this is an illegal assumption

                grid.children[i].value = possibles[i][0]
                grid.children[i].classList.add("found")
                }
            }
        else if (possibles[i].length != 1) { // if theres multiple possibilities
            grid.children[i].value = ""
            grid.children[i].classList.remove("found")
            grid.children[i].classList.remove("guess")
            remaining -= 1
        }
        grid2.children[i].textContent = (possibles[i].join(' '));
    }
    return remaining
}

function getvalues(){ // get initial values
    var values = []
    for (let i = 0; i < 81; i++) {
        values.push(parseInt(grid.children[i].value))
    }
    return values
}

function createpossibles(){
    var possibles = [] // initially set posibilities as any 
    for (let i = 0; i < 81; i++) {
        possibles.push([1,2,3,4,5,6,7,8,9])
    }
    return possibles
}

// function to reduce the list of possibles based on what can be played in the next move
function limitoptions(values, possibles){
    for (let i = 0; i < 81; i++) {
        if (! Number.isNaN(values[i])){ // if theres a number there
            possibles[i] = [values[i]]
            for (let o = 0; o < 81; o++) {
                if (i!=o && (getrow(i)==getrow(o) || getcol(i)==getcol(o) || getzone(i)==getzone(o))){
                    if (possibles[o].includes(values[i])) {possibles[o].splice(possibles[o].indexOf(values[i]),1)}
                }
            }
        }
    }
    return possibles
}

// if theres only n of the set length n, we can get rid of all other possibilities
function limitgroups(possibles){
    function isSubset(a, b) { // note that this is technically not for subsets
        if (a.length > b.length) {return true} // fixes increasing the possibilities unintentionally
        return a.some(item => b.includes(item));} // Function to return whether an array is a subset of another
    function getgroups(){ // Function to create list of groups
        const groups = [ // writing this out is more time effective than creating a function
        [0,1,2,9,10,11,18,19,20],
        [3,4,5,12,13,14,21,22,23],
        [6,7,8,15,16,17,24,25,26],
        [27,28,29,36,37,38,45,46,47],
        [30,31,32,39,40,41,48,49,50],
        [33,34,35,42,43,44,51,52,53],
        [54,55,56,63,64,65,72,73,74],
        [57,58,59,66,67,68,75,76,77],
        [60,61,62,69,70,71,78,79,80]] //zones

        for (let i = 0; i < 9; i++) { //add all rows
            var hold = []
            for (let o = 0; o < 9; o++) {hold.push(i*9+o)}
            groups.push(hold)
        }
        for (let i = 0; i < 9; i++) { //add all columns
            var hold = []
            for (let o = 0; o < 9; o++) {hold.push(i+o*9)}
            groups.push(hold)
        }
        return groups
    }
    function gettests(maxLength) { // Function to create list of test arrays
        const inputArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const result = [];
        
        function backtrack(startIndex, currentCombination) {
            if (currentCombination.length <= maxLength) {
            result.push([...currentCombination]);
            }

            for (let i = startIndex; i < inputArray.length; i++) {
            currentCombination.push(inputArray[i]);
            backtrack(i + 1, currentCombination);
            currentCombination.pop();
            }
        }
        
        backtrack(0, []);
        return result;
        }

    groups = getgroups()
    tests = gettests(6)
    tests.shift()

    for (let gcount = 0; gcount < groups.length; gcount++) {
        for (let tcount = 0; tcount < tests.length; tcount++) {
            group = groups[gcount]
            test = tests[tcount]

            haveSubset = []
            for (let i = 0; i < 9; i++) {
                if (isSubset(test,possibles[group[i]])){
                    haveSubset.push(group[i])
                }
            }
            if (haveSubset.length == test.length){ // if this is the only way it can be
                for (let i = 0; i < test.length; i++) { // for each involved cell
                    if (possibles[haveSubset[i]].length != 1) {
                        possibles[haveSubset[i]] = test
                    }
                }
            }
            if (haveSubset.length < test.length){return false} // if its impossible to finish
        }
    }
    return possibles
}

async function solve(){
    var last = 82
    var remaining = 81
    while (last != remaining && remaining != -1) {
        await delay(100)
        last = remaining
        var values = getvalues()
        var possibles = createpossibles()
        possibles = limitoptions(values,possibles) // reduces possible moves based on what can be legally placed
        remaining = update_possibles(possibles) // displays possible moves and finds if it has been complete
        await delay(100)
        possibles = limitgroups(possibles) // reduces possible moves as we know that if only n spots can take n numbers, they must appear here
        remaining = update_possibles(possibles) // displays possible moves and finds if it has been complete
    }

    if (remaining == -1){return}

    //if (remaining > 0) {return} // if there wasn't enough info to determine the solution
}

function resetValues(guesses){ // function to reset the values back to what it was before this recursive call
    for (let i = 0; i < guesses.length; i++) {
        grid.children[guesses[i]].value = ""
        //grid.children[guesses[i]].classList = ["cell"]
    }
}

async function pressGuess(){
    var count = 0
    success = false
    while (count<1000 && !success){
        var [guesses, success] = guess()
        await delay(5)
        resetValues(guesses)
        console.log(success)
        count += 1
    }
}

function guess(){
    var guesses = []
    var values = getvalues()
    var possibles = createpossibles()
    possibles = limitoptions(values, possibles)
    var remaining = update_possibles(possibles)

    while (remaining != -1 && remaining != 81) { // for all unknown cells
        var i = Math.floor(Math.random() * 80)
        while (grid.children[i].value != "") {
            i+=1;
            if (i>80){i=0} // if its at the end loop back around
        }
        
        var value = possibles[i][Math.floor(Math.random() * possibles[i].length)]
        if (!checkposition(i,value)){break}
        guesses.push(i)
        possibles[i] = [value]
        grid.children[i].classList.add("guess")
        grid.children[i].value = value
        values[i] = value
        values = getvalues()
        possibles = limitoptions(values, possibles)
        remaining = update_possibles(possibles, true)
        //await delay(0)

        
    }
    return [guesses,(remaining==81)]
}

function justCheck(){
    var values = getvalues()
    var possibles = createpossibles()
    limitoptions(values,possibles)
    update_possibles(possibles)
}