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
  const calc = document.getElementById("toCalcText");
  info = {};
  info["bank"] = nameBank.value;
  info["downPayment"] = downPayment.value;
  info["initialLoan"] = initialLoan.value;
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
        alert("change bank or up you downPayment");
        return;
      }
      const a = Math.pow(1 + obj.interestRate / 12, obj.loanTerm);
      const m =
        Math.round(
          ((info.initialLoan - info.downPayment) *
            (obj.interestRate / 12) *
            a) /
            (a - 1) +
            100
        ) / 100;

      let calcText = document.createElement("div");
      calcText.className = "calcText";
      calcText.innerHTML = `
            <p> You mounthly payment in ${obj.name} bank will be $${m}</p>
            `;
      calc.prepend(calcText);
    }
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

changeBtnColor();
isPush().then(showBanks());
