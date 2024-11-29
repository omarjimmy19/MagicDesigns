// All input Variables
let title = document.getElementById("title")
let omar = document.getElementById("omar")
let price = document.getElementById("price")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let tbl1 = document.getElementById("tbl1")
let count = document.getElementById("count")
let category = document.getElementById("category")
let search = document.getElementById("search");
let currUpdateBtn;
let searchedItem = "title";
let tbody = document.getElementById("tbody");


// Check for Product List in Local Storage
if (localStorage.getItem("products")){
    prodList = JSON.parse(localStorage.getItem("products"))
    console.log("found local storage");
}else {
    console.log("no local storage found");
}

// Calculate Total Price
function getTotalPrice(){
    if (price.value != "") {
        total.innerHTML = +price.value + - +discount.value;
        total.style.backgroundColor = "rgb(56, 146, 56)"
    }else {
        total.style.backgroundColor = "rgb(75, 5, 5)";
        total.innerHTML = ""
    }
}






// Create Product
function createProd(c) {
    if(c == ""){
        c = 1;
    }
    for (let i = 0; i < c; i++) {
        let thisProd = {
            title:title.value,
            omar:omar.value,
            price:price.value,
            discount:discount.value,
            total:total.innerHTML,
            tbl1:tbl1.innerHTML,
            category:category.value
        }
        prodList.push(thisProd);
        saveProd();
    }
    clearInput();
    showData();
    getTotalPrice();
}









// Save Data in LocalStorage
function saveProd(){
localStorage.setItem("products", JSON.stringify(prodList));
console.log("done!");
}




// Clear Inputs after creating a product
function clearInput(){
title.value = "";
omar.value = "";
price.value = "";
discount.value = "";
total.innerHTML = "";
tbl1.innerHTML = "";
count.value = "";
category.value = "";
}



// Read and Show Data In Table (output)
function showData() {
    let table = ``;
    for (let i = 0; i < prodList.length; i++) {
        table +=`           <tr>
                        <td>${i+1}</td>
                        <td>${prodList[i].title}</td>
                        <td>${prodList[i].omar}</td>
                        <td>${prodList[i].price}</td>
                        <td>${prodList[i].discount}</td>
                        <td>${prodList[i].total}</td>
                        <td>${prodList[i].category}</td>
                        <td><input onclick="updateProd(${i})" type="button" value="تحديث "></td>
                        <td><input onclick="deleteProd(${i})" type="button" value="مسح"></td>
                    </tr>`
        
    }
    tbody.innerHTML = table;
    
    let deleteAllBtn = document.getElementById("deleteAll");
    if (prodList.length < 1) {
        deleteAllBtn.style.display = "none";
    }else {deleteAllBtn.style.display = "block";
    deleteAllBtn.setAttribute("value",`مسح كل البيانات ( ${prodList.length} )`)
}
}








// Delete a product
function deleteProd(i) {
    prodList.splice(i,1);
    localStorage.products = JSON.stringify(prodList);
    showData();
}


// Submit button ( Create Or Update)
function submit(counter){
    if (title.value != "" && price.value !="" && category.value != ""){
    let btnValue = document.getElementById("create").getAttribute("value")
    console.log(btnValue)
    if ( btnValue == "Create") {
        createProd(counter);
    }else if (btnValue == "Update") {
        submitUpdate(currUpdateBtn);
    }
}
}




// Update a product
function updateProd(i) {
    currUpdateBtn = i;
    title.value = prodList[i].title;
    omar.value = prodList[i].omar;
    price.value = prodList[i].price;
    discount.value = prodList[i].discount;
    total.innerHTML = prodList[i].total;
    category.value = prodList[i].category;
    document.getElementById("create").setAttribute("value","Update");
    document.getElementById("count").setAttribute("disabled","true");
    getTotalPrice();
    scroll({
        top: 0,
        behavior: "smooth"
    })

}
function submitUpdate(i){ 
    prodList[i].title = title.value;
    prodList[i].omar = omar.value;
    prodList[i].price = price.value;
    prodList[i].discount = discount.value;
    prodList[i].total = total.innerHTML;
    prodList[i].category = category.value;
    localStorage.products = JSON.stringify(prodList);
    showData();
    document.getElementById("create").setAttribute("value","Create");
    clearInput();
    document.getElementById("count").setAttribute("disabled","false");
    getTotalPrice();
}


// Search
function searchName(id=searchedItem){
    searchedItem = id;
    let table = ``;
    search.setAttribute("placeholder",`Search by ${id}`)
    for (let i = 0; i < prodList.length; i++) {
        if(prodList[i][id].toLowerCase().includes(search.value.toLowerCase())){
        
        table +=`           <tr>
                        <td>${i+1}</td>
                        <td>${prodList[i].title}</td>
                        <td>${prodList[i].omar}</td>
                        <td>${prodList[i].price}</td>
                        <td>${prodList[i].discount}</td>
                        <td>${prodList[i].total}</td>
                        <td>${prodList[i].category}</td>
                        <td><input onclick="updateProd(${i})" type="button" value="Update"></td>
                        <td><input onclick="deleteProd(${i})" type="button" value="Delete"></td>
                    </tr>`
        
    
    

        }else{
                console.log("false");
            }
}
tbody.innerHTML = table;
}
let totalExpensesEl = document.getElementById("total-expenses");
let totalAdvanceEl = document.getElementById("total-advance");
let balanceEl = document.getElementById("balance");

// Product List from Local Storage

showData();
function calculateTotalsFromTable() {
    // جميع الصفوف داخل tbody
    const tableRows = document.querySelectorAll("#tbody tr");

    let totalAdvances = 0; // إجمالي العهدة (price)
    let totalExpenses = 0; // إجمالي المصاريف (discount)

    // اجمع القيم من الصفوف
    tableRows.forEach((row) => {
        const advanceCell = parseFloat(row.cells[1]?.textContent) || 0; // العهدة (price)
        const expenseCell = parseFloat(row.cells[2]?.textContent) || 0; // المصاريف (discount)

        totalAdvances += advanceCell; // إضافة إلى إجمالي العهدة
        totalExpenses += expenseCell; // إضافة إلى إجمالي المصاريف
    });

    // تحديث القيم في HTML
    document.getElementById("totalAdvances").textContent = totalAdvances.toFixed(2);
    document.getElementById("totalExpenses").textContent = totalExpenses.toFixed(2);
    document.getElementById("difference").textContent = (totalAdvances - totalExpenses).toFixed(2);
}

// استدعاء الحساب بعد تحديث الجدول
function showData() {
    let table = ``;

    for (let i = 0; i < prodList.length; i++) {
        table += `
            <tr>
                <td>${i + 1}</td>
               <td>${prodList[i].price}</td> <!-- العهدة -->
               <td>${prodList[i].discount}</td> <!-- المصاريف --> 
                <td>${prodList[i].title}</td>
                <td>${prodList[i].omar}</td>       
                <td>${prodList[i].total}</td>
                <td>${prodList[i].category}</td>
                <td><input onclick="updateProd(${i})" type="button" value="Update"></td>
                <td><input onclick="deleteProd(${i})" type="button" value="Delete"></td>
            </tr>`;
    }

    tbody.innerHTML = table;

    // حساب الإجماليات بعد تحديث البيانات
    calculateTotalsFromTable();
}
document.getElementById("share-whatsapp").addEventListener("click", function () {
    let table = document.getElementById("table");
    let rows = table.getElementsByTagName("tr");

    // اجمع البيانات من الجدول
    let message = "بيانات الجدول:\n\n";
    for (let i = 1; i < rows.length; i++) { // البدء من الصف الثاني لتجاهل العناوين
        let cells = rows[i].getElementsByTagName("td");
        if (cells.length > 0) {
            message += `ID: ${cells[0].innerText}, `;
            message += `مبلغ العهدة: ${cells[1].innerText}, `;
            message += `المصاريف: ${cells[2].innerText}, `;
            message += `إجمالي المصاريف: ${cells[3].innerText}, `;
            message += `إجمالي العهدة: ${cells[4].innerText}\n`;
        }
    }

    // إنشاء رابط واتساب
    let url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
});
