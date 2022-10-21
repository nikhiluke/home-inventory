let DATA_DIRECTORY = [];
function getDataDirectoryData() {
	fetch("https://home-inventory-server.herokuapp.com/readFile").then((res) => {
        let data = res.json();
        console.log(data);
    });
	const STORED_DATA_DIRECTORY = JSON.parse(
		localStorage.getItem("data_directory")
	);
	if (STORED_DATA_DIRECTORY !== null) {
		return STORED_DATA_DIRECTORY;
	} else {
		return DATA_DIRECTORY;
	}
}

function setDataDirectoryData(data_directory) {
	fetch("https://home-inventory-server.herokuapp.com/writeFile", {
		method: "POST",
		body: JSON.stringify(data_directory),
	}).then((res) => {
		if (res.json() === "Saved") {
			alert("Saved");
		}
	});
	localStorage.setItem("data_directory", JSON.stringify(data_directory));
	init_module();
}

function filterInventoryData(data_directory, sort_direction_up = true) {
	if (data_directory !== undefined && data_directory.length) {
		data_directory.sort((objA, objB) => {
			let objA_Comp = new Date(objA[["item-date"]]);
			let objB_Comp = new Date(objB[["item-date"]]);

			if (sort_direction_up) {
				return objB_Comp - objA_Comp;
			} else {
				return objA_Comp - objB_Comp;
			}
		});
	}

	return data_directory;
}

function submitFormData(event) {
	const data_directory = getDataDirectoryData();
	event.preventDefault();
	let formData = {};
	formData["id"] = Number(new Date());
	for (let obj of event.target) {
		formData[obj.name] = obj.value;
	}
	data_directory.push(formData);
	setDataDirectoryData(data_directory);
	event.target.reset();
}

function loadData() {
	const data_directory = filterInventoryData(getDataDirectoryData());
	const tableBody = document.getElementsByClassName("entry-table-body")[0];
	let tableBodyData = "";
	data_directory.map((obj, index) => {
		const data_row = `
        <tr>
            <td>${index}</td>
            <td>${obj["item-date"]}</td>
            <td>${obj["item-name"]}</td>
            <td>${obj["item-taker-person-name"]}</td>
            <td><input type="checkbox" class="item-data" data-value="${obj["id"]}"></input></td>
        </tr>`;

		tableBodyData = tableBodyData + data_row;
	});

	tableBody.innerHTML = tableBodyData;
}

function deleteDataEntry(id) {
	const data_directory = getDataDirectoryData();
	const new_data_directory = data_directory.filter((item) => {
		console.log(item);
		return Number(item.id) !== Number(id);
	});
	setDataDirectoryData(new_data_directory);
}

function loadEvents() {
	const item_data = document.getElementsByClassName("item-data");
	for (let obj of item_data) {
		obj.addEventListener("click", function () {
			console.log(this.dataset.value);
			deleteDataEntry(this.dataset.value);
		});
	}
}

function init_module() {
	loadData();
	loadEvents();
}

init_module();
