const grid = document.getElementById("grid");

for (let i = 0; i < 81; i++) {
	var cell = document.createElement("INPUT");
    cell.classList.add("cell")
    grid.appendChild(cell)
} 