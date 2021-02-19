localStorage.i = 0;

function addBank() {
  isBeen = true;
  const bank = {};
  bank["name"] = addNameBank.value;
  bank["interestRate"] = Number(addInterestRate.value);
  bank["maxLoan"] = Number(addMaxLoan.value);
  bank["minDownPayment"] = Number(addMinDownPayment.value);
  bank["loanTerm"] = Number(addLoanTerm.value);

  let keys = Object.keys(localStorage);
  for (let key of keys) {
    let obj = JSON.parse(localStorage.getItem(`${key}`));
    if (obj.name == bank.name) {
      localStorage.removeItem(`${key}`);
    }
  }
  localStorage.setItem(
    `${Number(localStorage.getItem("i")) + 1}`,
    JSON.stringify(bank)
  );
  localStorage.i++;
  showBanks();
  showListBanks();
  getClearValues(
    addNameBank,
    addInterestRate,
    addMaxLoan,
    addMinDownPayment,
    addLoanTerm
  );
}

function changeBtnColor() {
  const clickAdd = document.getElementById("btnAddBank");
  clickAdd.addEventListener("mousedown", () => {
    clickAdd.style.backgroundColor = "red";
    setTimeout(() => (clickAdd.style.backgroundColor = ""), 1000);
  });
}

function changeDelBtnColor() {
  const buttn = [...document.getElementsByClassName("btnDel")];
  buttn.forEach((btn, ind) => {
    btn.addEventListener("mousedown", () => {
      btn.style.backgroundColor = "red";
      setTimeout(() => (btn.style.backgroundColor = ""), 1000);
      localStorage.removeItem(btn.getAttribute("id"));
      showBanks();
      showListBanks();
    });
  });
}

function showBanks() {
  const div = document.getElementById("table");
  div.innerHTML = "";
  let row = document.createElement("div");
  row.className = "tableRow";

  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key == `i`) {
      continue;
    }
    const obj = JSON.parse(localStorage.getItem(`${key}`));
    for (let value of Object.values(obj)) {
      let column = document.createElement("div");
      column.className = "tableColumn";
      column.innerHTML = `
                    ${value}
                `;
      row.append(column);
    }
    div.prepend(row);

    let btnDel = document.createElement("div");
    btnDel.className = "btnDel";
    btnDel.id = `${key}`;
    btnDel.innerHTML = "Dell";
    row.append(btnDel);
  }

  changeDelBtnColor();
}

function getCalculate() {
  document.getElementById("resultTable").innerHTML = "";
  if (nameBank.value == "") {
    alert("Take the bank!!");
    return;
  }
  const calc = document.getElementById("toCalcText");
  let arrTable = [];
  let info = {};

  info["bank"] = nameBank.value;
  info["downPayment"] = Number(downPayment.value);
  info["initialLoan"] = Number(initialLoan.value);
  let isName = true;
  console.log(info);

  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key == `i`) {
      continue;
    }
    const obj = JSON.parse(localStorage.getItem(`${key}`));
    if (obj.name == info.bank) {
      isName = true;
      if (obj.minDownPayment > info.downPayment) {
        alert("change bank or up you downPayment!");
        return;
      }

      if (info.initialLoan > obj.maxLoan) {
        alert("change bank or down you loan!");
        return;
      }

      const a = Math.pow(1 + obj.interestRate / 100 / 12, obj.loanTerm);
      const totalPayment =
        Math.round(
          (info.initialLoan - info.downPayment) *
            (obj.interestRate / 100 / 12 +
              obj.interestRate / 100 / 12 / (a - 1)) *
            100
        ) / 100;

      getCalcTable(
        info.initialLoan - info.downPayment,
        obj.loanTerm,
        obj.interestRate,
        totalPayment,
        arrTable
      );

      console.log(arrTable);

      //let calcText = document.createElement("div");
      //calcText.className = "calcText";
      //calcText.innerHTML = `
      //       <p> You mounthly payment in ${obj.name} bank will be $${totalPayment}</p>
      //      `;
      // calc.prepend(calcText);
    }
  }

  function creatColDiv(value, row) {
    let tableResCol = document.createElement("div");
    tableResCol.className = "tableResCol";
    tableResCol.innerHTML = `
                ${value}
                `;
    row.append(tableResCol);
  }

  function createRowDiv(col1, col2, col3, col4, div) {
    let tableResRow = document.createElement("div");
    tableResRow.className = "tableResRow";
    creatColDiv(`${col1}`, tableResRow);
    creatColDiv(`${col2}`, tableResRow);
    creatColDiv(`${col3}`, tableResRow);
    creatColDiv(`${col4}`, tableResRow);
    div.append(tableResRow);
  }

  let calcTableText = document.getElementById("resultTable");
  arrTable.forEach((arr, ind) => {
    if (!ind) {
      createRowDiv(
        `month`,
        `IntPayment`,
        `TotalPayment`,
        "LoanBalance",
        calcTableText
      );
    }
    createRowDiv(
      arr.month,
      arr.interestPayment,
      arr.totalPayment,
      arr.loanBalance,
      calcTableText
    );
  });

  showTable();
  getClearValues(nameBank, downPayment, initialLoan);
}

function showListBanks() {
  delDivs();
  const div = document.getElementById("banks");
  for (let key in localStorage) {
    if (!localStorage.hasOwnProperty(key) || key == `i`) {
      continue;
    }
    const obj = JSON.parse(localStorage.getItem(`${key}`));
    let option = document.createElement("option");
    option.className = "banksOption";
    option.value = obj.name;
    div.append(option);
  }
}

function isPush() {
  return new Promise((resolve) => {
    const addClick = document.getElementById("btnAddBank");
    if (addClick.style.backgroundColor == "red") {
      resolve();
    }
  });
}

function isInputBanks() {
  let click = false;
  return new Promise((resolve) => {
    const addClick = document.getElementById(`banks`);
    addClick.addEventListener("focus", () => {
      click = true;
    });
    if (click) {
      resolve();
    }
  });
}

function delDivs() {
  var blocks = document.querySelectorAll("#banks");

  blocks.forEach(function (block) {
    var children = Array.prototype.slice.call(block.children);

    children.forEach(function (child) {
      if (!child.classList.contains("visible")) {
        block.removeChild(child);
      }
    });
  });
}

function getClearValues(...values) {
  values.forEach((val) => {
    val.value = "";
  });
}

function getCalcTable(loan, loanTerm, interestRate, m, arr) {
  for (var i = 0; i < loanTerm; i++) {
    let objTable = {};
    objTable["month"] = i + 1;
    objTable["totalPayment"] = m;
    objTable["interestPayment"] =
      Math.round(loan * (interestRate / 100 / 12) * 100) / 100;
    loan = Math.round((loan - m + objTable.interestPayment) * 100) / 100;
    objTable["loanBalance"] = loan;

    arr.push(objTable);
    //console.log(objTable);
  }
}

function showTable() {
  const block = document.getElementById(`resultTableWrapper`);
  block.style.display = `block`;
}

function hideTable() {
  const block = document.getElementById(`resultTableWrapper`);
  block.style.display = `none`;
}

changeBtnColor();
isPush().then(showBanks());
isInputBanks().then(showListBanks());
