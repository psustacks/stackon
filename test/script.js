document.addEventListener("DOMContentLoaded", function () {
    const existingCategories = document.getElementById("existingCategories");
    const downloadButton = document.getElementById("downloadData");
    const successMessage = document.getElementById("successMessage");
    const newItemAccordion = document.getElementById("newItemAccordion"); // Accordion for new item form
    const addNewItemButton = document.getElementById("addNewItem"); // Button to add new item
    const locationSelect = document.getElementById("location");
    const areaSelect = document.getElementById("area");
    const categorySelectNewItem = document.getElementById("category");

    let changes = {}; // Store only the changes made by the user
    let currentLocationData = []; // To store items filtered by the selected location
    let cachedData = getCachedData(); // Cache only product quantities

    const accessCodes = {
        abg6200: ["Biscotti", "Stacks", "Outpost", "Provisions"],
        rad15: ["Outpost", "Provisions"],
        ckt5383: ["Biscotti", "Stacks", "Outpost", "Provisions"],
        rxf5209: ["Biscotti", "Stacks", "Outpost", "Provisions"],
        plm16: ["Stacks"],
    };

    const deadlines = {
        Biscotti: "Order",
        Stacks: "Order",
        Outpost: "Order",
        // Add other location deadlines here
    };

    const filterOptions = document.getElementById("filterOptions");
    const locationSelectFilter = document.getElementById("LocationSelect");
    const areaSelectFilter = document.getElementById("AreaSelect");
    const categorySelectFilter = document.getElementById("categorySelect");
    const itemTableBody = document.getElementById("itemTableBody");

    // Function to sort options alphabetically
    function sortAlphabetically(arr) {
        return arr.sort((a, b) => a.localeCompare(b));
    }

    // Function to populate dropdowns for the new item form
    function populateDropdowns() {
        const locations = [...new Set(data.map(item => item.Location))];
        const areas = [...new Set(data.map(item => item.Area))];
        const categories = [...new Set(data.map(item => item.Category))];

        populateSelect(locationSelect, locations);
        populateSelect(areaSelect, areas);
        populateSelect(categorySelectNewItem, categories);
    }

    function populateSelect(selectElement, items) {
        selectElement.innerHTML = ''; // Clear existing options
        items.forEach(item => {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
    }

    // Function to populate categories based on selected Area
    function populateCategories(area) {
        const filteredData = currentLocationData.filter(
            (item) => item.Area === area
        );
        const categories = [...new Set(filteredData.map((item) => item.Category))];

        // Sort categories alphabetically
        const sortedCategories = sortAlphabetically(categories);

        categorySelectFilter.innerHTML = "";
        sortedCategories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelectFilter.appendChild(option);
        });

        // Populate items for the first category by default
        if (sortedCategories.length > 0) {
            categorySelectFilter.value = sortedCategories[0];
            populateTable(sortedCategories[0], area);
        }
    }

    // Function to populate Areas based on selected Location
    function populateAreas(location) {
        const filteredData = currentLocationData.filter(
            (item) => item.Location === location
        );
        const areas = [...new Set(filteredData.map((item) => item.Area))];

        // Sort areas alphabetically
        const sortedAreas = sortAlphabetically(areas);

        areaSelectFilter.innerHTML = "";
        sortedAreas.forEach((area) => {
            const option = document.createElement("option");
            option.value = area;
            option.textContent = area;
            areaSelectFilter.appendChild(option);
        });

        // Populate categories for the first area by default
        if (sortedAreas.length > 0) {
            areaSelectFilter.value = sortedAreas[0];
            populateCategories(sortedAreas[0]);
        }

        // Display the deadline note for the selected location
        document.getElementById("locationNote").textContent =
            deadlines[location] || "";
    }

    // Function to populate Locations based on access code
    function populateLocations(accessCode) {
        const locations = accessCodes[accessCode] || [];

        // Sort locations alphabetically
        const sortedLocations = sortAlphabetically(locations);

        locationSelectFilter.innerHTML = "";
        sortedLocations.forEach((location) => {
            const option = document.createElement("option");
            option.value = location;
            option.textContent = location;
            locationSelectFilter.appendChild(option);
        });

        // Populate areas for the first location by default
        if (sortedLocations.length > 0) {
            locationSelectFilter.value = sortedLocations[0];
            filterItemsByLocation(sortedLocations[0]);
        }
    }

    // Function to filter items by selected location
    function filterItemsByLocation(location) {
        currentLocationData = data.filter((item) => item.Location === location);
        populateAreas(location); // Populate areas and categories based on filtered data
    }

    // Function to populate items table based on selected category and Area
    function populateTable(category, area) {
        const filteredData = currentLocationData.filter(
            (item) => item.Category === category && item.Area === area
        );
        renderItems(filteredData);
    }

    // Function to show item details in a popup
    function showItemDetails(item) {
        itemDetails.innerHTML = `
        <p><strong>Item ID:</strong> ${item["Item ID"]}</p>
        <p><strong>Name:</strong> ${item.Name}</p>
        <p><strong>Unit Size:</strong> ${item["Unit Size"]}</p>
        <p><strong>Category:</strong> ${item.Category}</p>
        <p><strong>Location:</strong> ${item.Location}</p>
        <p><strong>Area:</strong> ${item.Area}</p>
    `;
        itemDetailsPopup.style.display = "block";
    }

    // Event listener to close the popup
    closePopup.addEventListener("click", function () {
        itemDetailsPopup.style.display = "none";
    });

    // Function to render items
    function renderItems(items) {
        itemTableBody.innerHTML = ""; // Clear existing rows
        items.forEach((item) => {
            const key = `${item["Item ID"]}-${item.Category}-${item.Location}`;
            const itemQuantity = changes[key] || cachedData[key] || item["Order Quantity"];
            const row = document.createElement("tr");
            row.innerHTML = `
              <td>${item["Item ID"]}</td>
              <td>${item.Name}</td>
              <td>${item["Unit Size"]}</td>
              <td>
                  <div class="quantity-control">
                      <span class="quantity-down">-</span>
                      <input type="number" value="${itemQuantity}" min="0" class="form-control" data-id="${item["Item ID"]}">
                      <span class="quantity-up">+</span>
                  </div>
              </td>
          `;

            // Add click event listener to the row
            row.addEventListener("click", function () {
                showItemDetails(item);
            });

            itemTableBody.appendChild(row);
        });

        // Add event listeners to quantity spans
        document.querySelectorAll("#itemTableBody .quantity-up").forEach((span) => {
            span.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent row click event
                const input = this.parentElement.querySelector("input");
                input.value = parseInt(input.value) + 1;
                updateQuantity(input);
            });
        });

        document
            .querySelectorAll("#itemTableBody .quantity-down")
            .forEach((span) => {
                span.addEventListener("click", function (event) {
                    event.stopPropagation(); // Prevent row click event
                    const input = this.parentElement.querySelector("input");
                    if (parseInt(input.value) > 0) {
                        input.value = parseInt(input.value) - 1;
                        updateQuantity(input);
                    }
                });
            });

        // Add event listeners to inputs
        document.querySelectorAll("#itemTableBody input").forEach((input) => {
            input.addEventListener("change", function (event) {
                event.stopPropagation(); // Prevent row click event
                updateQuantity(this);
            });
        });
    }

    // Event listener for access code input
    document.getElementById("accessCode").addEventListener("input", function () {
        const accessCode = this.value.trim();
        if (accessCode === "abg6200") {
            newItemAccordion.style.display = "block"; // Show the new item form only for specific access code
        } else {
            newItemAccordion.style.display = "none"; // Hide the new item form for other codes
        }

        if (accessCodes[accessCode]) {
            filterOptions.style.display = "block"; // Show the filter options
            populateLocations(accessCode); // Populate locations based on the entered code
            localStorage.setItem('accessCode', accessCode); // Store the access code
        } else {
            filterOptions.style.display = "none"; // Hide the filter options if the code is invalid
        }
    });

    // Event listener for adding a new item
    addNewItemButton.addEventListener("click", function () {
        const newItem = {
            "Item ID": parseInt(document.getElementById("itemId").value, 10),
            Name: document.getElementById("itemName").value,
            "Unit Size": document.getElementById("unitSize").value,
            "Order Quantity": parseInt(document.getElementById("orderQuantity").value, 10),
            Category: categorySelectNewItem.value,
            Location: locationSelect.value,
            Area: areaSelect.value,
        };

        // Append new item to data array (you'll need a way to persist this change, e.g., save to a server)
        data.push(newItem);

        // Clear form inputs after adding the item
        document.getElementById("itemId").value = "";
        document.getElementById("itemName").value = "";
        document.getElementById("unitSize").value = "";
        document.getElementById("orderQuantity").value = "";

        successMessage.textContent = "New item added successfully!";
        successMessage.style.display = "block"; // Show success message
        setTimeout(() => {
            successMessage.style.display = "none"; // Hide success message after 2 seconds
        }, 2000);
    });

    function updateQuantity(input) {
        const itemId = input.getAttribute("data-id");
        const category = categorySelectFilter.value;
        const location = locationSelectFilter.value;
        const key = `${itemId}-${category}-${location}`;
        
        changes[key] = parseInt(input.value, 10) || 0; // Store updated quantity
        cacheData(); // Cache data on update
        console.log(`Updated quantity for Item ID ${itemId} in ${category} at ${location}: ${changes[key]}`); // Debugging line
    }

    function createExcelFile(jsonObject) {
        const worksheet = XLSX.utils.json_to_sheet(jsonObject);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
        return workbook;
    }

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    function sendFormData(formData) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "donotopen.php", true); // Ensure this URL is correct
        xhr.onload = function () {
            if (xhr.status === 200) {
                successMessage.textContent = "File sent successfully!";
                successMessage.style.display = "block"; // Show success message
                setTimeout(() => {
                    location.reload(); // Refresh the page after 2 seconds
                }, 2000);
                clearCache(); // Clear cache after successful submission
            } else {
                alert("Failed to send file.");
            }
        };
        xhr.send(formData);
    }

    function cacheData() {
        const timestamp = new Date().getTime();
        localStorage.setItem('changes', JSON.stringify(changes));
        localStorage.setItem('cacheTimestamp', timestamp);
    }

    function getCachedData() {
        const cachedChanges = localStorage.getItem('changes');
        const cacheTimestamp = localStorage.getItem('cacheTimestamp');
        const now = new Date().getTime();

        // Cache time set to 2 hours
        if (cachedChanges && cacheTimestamp && now - cacheTimestamp < 2 * 60 * 60 * 1000) {
            return JSON.parse(cachedChanges);
        } else {
            clearCache(); // Purge cache if expired
            return {};
        }
    }

    function clearCache() {
        localStorage.removeItem('changes');
        localStorage.removeItem('cacheTimestamp');
    }

    // Initialize dropdowns on page load
    populateDropdowns();
});
