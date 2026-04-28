function remove_etf() {
  console.log("start to change table");
  var table = document.getElementById("flex_qdiie");
  var row = table.rows; // Getting the rows
  console.log("talbe length", row.length);

  for (let i = row.length - 1; i >= 2; i--) {
    let content = row[i].cells[1].textContent;
    if (content.includes("ETF")) {
      console.log("delete row", i);
      table.deleteRow(i);
    }
  }
}

function remove_etf_asia() {
  console.log("start to change table");
  var table = document.getElementById("flex_qdiia");
  var row = table.rows; // Getting the rows
  console.log("talbe length", row.length);

  for (let i = row.length - 1; i >= 2; i--) {
    let content = row[i].cells[1].textContent;
    if (content.includes("ETF")) {
      console.log("delete row", i);
      table.deleteRow(i);
    }
  }
}
var link = document.querySelector('a[href="javascript:showQDIIE();"]');
let origin_click = link.onclick;
link.addEventListener(
  "click",
  function (event) {
    // 阻止默认的链接跳转行为（如果需要）
    // event.preventDefault();
    if (origin_click) {
      origin_click.call(link);
    }
    console.log(event);
    console.log("链接被点击了");
    setTimeout(() => {
      remove_etf();
    }, 500);
  },
  false
);
// remove_etf();

const button = document.createElement("button");
button.textContent = "只显示LOF";
button.id = "myButton";
// 将创建好的button元素添加到a标签后面（也就是a标签的父节点中紧跟a标签之后）
link.parentNode.insertBefore(button, link.nextSibling);
button.addEventListener("click", function (event) {
  remove_etf();
});


// 亚洲
var link_asia = document.querySelector('a[href="javascript:showQDIIA();"]');
let origin_click_asia = link_asia.onclick;
link_asia.addEventListener(
  "click",
  function (event) {
    // 阻止默认的链接跳转行为（如果需要）
    // event.preventDefault();
    if (origin_click_asia) {
      origin_click_asia.call(link_asia);
    }
    console.log(event);
    console.log("链接被点击了");
    setTimeout(() => {
      remove_etf_asia();
    }, 500);
  },
  false
);
// remove_etf();

const button_asia = document.createElement("button");
button_asia.textContent = "只显示LOF";
button_asia.id = "myButton";
// 将创建好的button元素添加到a标签后面（也就是a标签的父节点中紧跟a标签之后）
link_asia.parentNode.insertBefore(button_asia, link_asia.nextSibling);
button_asia.addEventListener("click", function (event) {
  remove_etf_asia();
});