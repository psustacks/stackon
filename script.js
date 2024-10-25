document.addEventListener("DOMContentLoaded", function () {
  const existingCategories = document.getElementById("existingCategories");
  const downloadButton = document.getElementById("downloadData");
  const orderDate = document.getElementById("orderDate");
  const successMessage = document.getElementById("successMessage");

  let changes = {}; // Store only the changes made by the user
  let currentLocationData = []; // To store items filtered by the selected location
  let currentModalLocationData = [];
  let cachedData = getCachedData();

  const accessCodes = {
    abg6200: ["Biscotti", "Stacks", "Outpost", "Provisions"],
    rad15: ["Outpost", "Provisions"],
    ckt5383: ["Biscotti", "Stacks", "Outpost", "Provisions"],
    rxf5209: ["Biscotti", "Stacks", "Outpost", "Provisions"],
    nad5490: ["Biscotti", "Stacks", "Outpost", "Provisions"],
    plm16: ["Stacks"],
    gym6: ["Outpost", "Biscotti"],
    dkh11: ["Biscotti"],
    pjc178: ["Stacks"],
    azs441: ["Biscotti", "Stacks", "Outpost", "Provisions"],
  };

  let addButtonAccess = ["abg6200", "ckt5383", "azs441"];

  const deadlines = {
    Biscotti: "Order",
    Stacks: "Order",
    Outpost: "Order",
    // Add other location deadlines here
  };

  const filterOptions = document.getElementById("filterOptions");
  const locationSelect = document.getElementById("LocationSelect");
  const areaSelect = document.getElementById("AreaSelect");
  const categorySelect = document.getElementById("categorySelect");

  const modalLocationSelect = document.getElementById("modalLocation");
  const modalAreaSelect = document.getElementById("modalArea");
  const modalCategorySelect = document.getElementById("modalCategory");

  const itemTableBody = document.getElementById("itemTableBody");

  // Function to sort options alphabetically
  function sortAlphabetically(arr) {
    return arr.sort((a, b) => a.localeCompare(b));
  }

  // Function to populate categories based on selected Area
  function populateCategories(area) {
    const filteredData = currentLocationData.filter(
      (item) => item.Area === area
    );
    const categories = [...new Set(filteredData.map((item) => item.Category))];

    // Sort categories alphabetically
    const sortedCategories = sortAlphabetically(categories);

    categorySelect.innerHTML = "";
    sortedCategories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    // Populate items for the first category by default
    if (sortedCategories.length > 0) {
      categorySelect.value = sortedCategories[0];
      populateTable(sortedCategories[0], area);
    }
  }

  // Function to populate modal Categories based on selected area
  function populateModalCategories(area) {
    const filteredData = currentModalLocationData.filter(
        (item) => item.Area === area
    );
    const categories = [...new Set(filteredData.map((item) => item.Category))];
    const sortedCategories = sortAlphabetically(categories);

    modalCategorySelect.innerHTML = ""; // Clear existing options
    sortedCategories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        modalCategorySelect.appendChild(option);
    });
  }

  // Function to populate Areas based on selected Location
  function populateAreas(location) {
    const filteredData = currentLocationData.filter(
      (item) => item.Location === location
    );
    const areas = [...new Set(filteredData.map((item) => item.Area))];

    // Sort areas alphabetically
    const sortedAreas = sortAlphabetically(areas);

    areaSelect.innerHTML = "";
    sortedAreas.forEach((area) => {
      const option = document.createElement("option");
      option.value = area;
      option.textContent = area;
      areaSelect.appendChild(option);
    });

    // Populate categories for the first area by default
    if (sortedAreas.length > 0) {
      areaSelect.value = sortedAreas[0];
      populateCategories(sortedAreas[0]);
    }

    // Display the deadline note for the selected location
    document.getElementById("locationNote").textContent =
      deadlines[location] || "";
  }

  // Function to populate modal Areas based on selected location
  function populateModalAreas(location) {
    const filteredData = currentModalLocationData.filter(
        (item) => item.Location === location
    );
    const areas = [...new Set(filteredData.map((item) => item.Area))];
    const sortedAreas = sortAlphabetically(areas);

    modalAreaSelect.innerHTML = ""; // Clear existing options
    sortedAreas.forEach((area) => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        modalAreaSelect.appendChild(option);
    });

    // Populate categories for the first area by default
    if (sortedAreas.length > 0) {
        modalAreaSelect.value = sortedAreas[0];
        populateModalCategories(sortedAreas[0]);
    }
  }

  // Function to show addItem button based on access code
  document.getElementById('accessCode').addEventListener('input', function () {
    const enteredCode = this.value;
    const addItemButton = document.getElementById('addItem');

    // Show or hide "Add Item" button based on access
    if (addButtonAccess.includes(enteredCode)) {
      addItemButton.style.display = 'inline-block';
    } else {
      addItemButton.style.display = 'none';
    }
  });

  // Function to populate Locations based on access code
  function populateLocations(accessCode) {
    const locations = accessCodes[accessCode] || [];

    // Sort locations alphabetically
    const sortedLocations = sortAlphabetically(locations);

    locationSelect.innerHTML = "";
    sortedLocations.forEach((location) => {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      locationSelect.appendChild(option);
    });

    // Populate areas for the first location by default
    if (sortedLocations.length > 0) {
      locationSelect.value = sortedLocations[0];
      filterItemsByLocation(sortedLocations[0]);
    }
  }

  // Function to populate modal Locations based on access code
  function populateModalLocations(accessCode) {
    const locations = accessCodes[accessCode] || [];
    const sortedLocations = sortAlphabetically(locations);

    modalLocationSelect.innerHTML = ""; // Clear existing options
    sortedLocations.forEach((location) => {
        const option = document.createElement("option");
        option.value = location;
        option.textContent = location;
        modalLocationSelect.appendChild(option);
    });

    // Populate areas for the first location by default
    if (sortedLocations.length > 0) {
        modalLocationSelect.value = sortedLocations[0];
        populateModalAreas(sortedLocations[0]);
    }
  }

  // Function to filter items by selected location
  function filterItemsByLocation(location) {
    currentLocationData = data.filter((item) => item.Location === location);
    populateAreas(location); // Populate areas and categories based on filtered data
  }

  // Function to filter items by selected location
  function filterItemsByLocationModal(location) {
    currentModalLocationData = data.filter((item) => item.Location === location);
    populateModalAreas(location); // Populate modal areas and modal category based on filtered data
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
        <p><strong>Item ID:</strong> ${item.Item_ID}</p>
        <p><strong>Name:</strong> ${item.Name}</p>
        <p><strong>Unit Size:</strong> ${item.Unit_Size}</p>
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
      const key = `${item.Item_ID}-${item.Category}-${item.Location}`;
      const itemQuantity = changes[key] || cachedData[key] || item.Order_Quantity;
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${item.Item_ID}</td>
              <td>${item.Name}</td>
              <td>${item.Unit_Size}</td>
              <td>
                  <div class="quantity-control">
                      <span class="quantity-down">-</span>
                      <input type="number" value="${itemQuantity}" min="0" class="form-control" data-id="${item.Item_ID}">
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
    if (accessCodes[accessCode]) {
      filterOptions.style.display = "block"; // Show the filter options
      populateLocations(accessCode); // Populate locations based on the entered code
      localStorage.setItem("accessCode", accessCode); // Store the access code
    } else {
      filterOptions.style.display = "none"; // Hide the filter options if the code is invalid
    }
  });

  // Event listener for Location selection
  locationSelect.addEventListener("change", function () {
    filterItemsByLocation(this.value);
  });

  // Event listener for Area selection
  areaSelect.addEventListener("change", function () {
    populateCategories(this.value);
  });

  // Event listener for category selection
  categorySelect.addEventListener("change", function () {
    const area = areaSelect.value;
    populateTable(this.value, area);
  });

  // Event listener for Modal Location selection
  modalLocationSelect.addEventListener("change", function () {
    filterItemsByLocationModal(this.value);
  });

  // Event listener for Modal Area selection
  modalAreaSelect.addEventListener("change", function () {
    populateModalCategories(this.value);
  });


  // Event listener for Search Input
  document.getElementById("searchInput").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const filteredItems = currentLocationData.filter(
      (item) =>
        item.Item_ID.toString().includes(searchTerm) ||
        item.Name.toLowerCase().includes(searchTerm)
    );
    renderItems(filteredItems);
  });

  // Event Listener to handle item addition
  document.getElementById('addItemForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect values from form fields
    const itemId = document.getElementById('itemId').value;
    const name = document.getElementById('itemName').value;
    const unitSize = document.getElementById('unitSize').value;
    const orderQuantity = 0;
    const category = document.getElementById('modalCategory').value;
    const location = document.getElementById('modalLocation').value;
    const area = document.getElementById('modalArea').value;

    // Create new item object
    const newItem = {
        Item_ID: itemId,
        Name: name,
        Unit_Size: unitSize,
        Order_Quantity: orderQuantity,
        Category: category,
        Location: location,
        Area: area
    };

    // Append to the data list
    data.push(newItem);

    // debug
    console.log("New item added:", newItem);
    console.log("Updated data:", data);

    // Close modal after submitting
    const modal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
    modal.hide();

    document.getElementById('addItemForm').reset();
  });

  // Event Listener to handle getting the user ID on the button click
  document.getElementById('addItem').addEventListener('click', function(event) {
    const accessCode = document.getElementById("accessCode").value.trim();
    populateModalLocations(accessCode);
  });

  // Listen for changes in the date input
  orderDate.addEventListener("input", function () {
      if (orderDate.value) {
          downloadButton.disabled = false;  // Enable button if date is selected
      } else {
          downloadButton.disabled = true;   // Keep button disabled if no date is selected
      }
  });

  //   // Print the selected date when "Print Date" is clicked
  // document.getElementById("printDate").addEventListener("click", function () {
  //   const selectedDate = orderDate.value;
  //   console.log("Selected Date:", selectedDate);
  // });

  downloadButton.addEventListener("click", function () {
    const itemsToOrder = data
      .map((item) => {
        const key = `${item.Item_ID}-${item.Category}-${item.Location}`;
        const updatedQuantity = changes[key];
        if (updatedQuantity !== undefined) {
          // Only include relevant fields for Excel attachment
          return {
            "Item ID": item.Item_ID,
            "Name": item.Name,
            "Unit Size": item.Unit_Size,
            "Order Quantity": updatedQuantity,
          };
        }
        return null;
      })
      .filter((item) => item !== null && item["Order_Quantity"] > 0); // Only include items with quantity > 0

    if (itemsToOrder.length > 0) {
      const workbook = createExcelFile(itemsToOrder);
      const file = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });

      // Convert the binary string to a Blob
      const blob = new Blob([s2ab(file)], { type: "application/octet-stream" });

      // Create a FormData object and append the Blob
      const formData = new FormData();
      formData.append("file", blob, "order_data.xlsx");
      formData.append("accessCode", localStorage.getItem("accessCode"));
      formData.append("orderDate", orderDate.value); // Including the orderDate in the form
      formData.append("orderData", JSON.stringify(itemsToOrder)); // Add order data for the email body
      formData.append("location", locationSelect.value); // Include location in form data

      // Send the form data to the PHP script
      sendFormData(formData);
    } else {
      alert("No items to send.");
    }
  });

  function updateQuantity(input) {
    const itemId = input.getAttribute("data-id");
    const category = categorySelect.value;
    const location = locationSelect.value;
    const key = `${itemId}-${category}-${location}`;

    changes[key] = parseInt(input.value, 10) || 0; // Store updated quantity
    cacheData(); // Cache data on update
    console.log(
      `Updated quantity for Item ID ${itemId} in ${category} at ${location}: ${changes[key]}`
    ); // Debugging line
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
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  function sendFormData(formData) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/donotopen.php", true); // Your PHP file URL
    xhr.onload = function () {
      if (xhr.status === 200) {
        new bootstrap.Modal(document.getElementById("successModal")).show();
        clearCache(); // Clear cache after successful submission
      } else {
        alert("Failed to send file.");
      }
    };
    xhr.send(formData);
  }

  function cacheData() {
    const timestamp = new Date().getTime();
    localStorage.setItem("changes", JSON.stringify(changes));
    localStorage.setItem("cacheTimestamp", timestamp);
  }

  function getCachedData() {
    const cachedChanges = localStorage.getItem("changes");
    const cacheTimestamp = localStorage.getItem("cacheTimestamp");
    const now = new Date().getTime();

    // Cache time set to 2 hours
    if (
      cachedChanges &&
      cacheTimestamp &&
      now - cacheTimestamp < 2 * 60 * 60 * 1000
    ) {
      return JSON.parse(cachedChanges);
    } else {
      clearCache(); // Purge cache if expired
      return {};
    }
  }

  function clearCache() {
    localStorage.removeItem("changes");
    localStorage.removeItem("cacheTimestamp");
  }

});
