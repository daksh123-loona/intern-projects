const disp = document.querySelector(".display");
const ops = ["+", "-", "*", "/"];
let expr = "";
let fresh = false;

function update() {
  disp.value = expr || "";
}

function press(val) {
  if (val === "AC") {
    expr = "";
    fresh = false;
    update();
    return;
  }
  if (val === "DEL") {
    expr = expr.slice(0, -1);
    fresh = false;
    update();
    return;
  }

  if (val === "%") {
    if (!expr) return;
    const num = parseFloat(expr);
    if (!isNaN(num)) {
      expr = String(num / 100);
      update();
    }
    return;
  }

  if (val === "=") {
    if (!expr) return;
    try {
      if (!/^[\d+\-*/.() ]+$/.test(expr)) throw "bad";
      let r = Function('"use strict"; return (' + expr + ")")();
      if (!isFinite(r)) throw "inf";
      expr = parseFloat(r.toFixed(10)).toString();
      fresh = true;
      update();
    } catch (e) {
      expr = "Error";
      update();
      setTimeout(() => {
        expr = "";
        update();
      }, 1200);
    }
    return;
  }

  const isOp = ops.includes(val);
  const last = expr.slice(-1);

  if (fresh && !isOp) expr = "";
  fresh = false;

  if (isOp) {
    if (expr === "" && val !== "-") return;
    if (ops.includes(last)) expr = expr.slice(0, -1);
  }

  if (val === ".") {
    const segs = expr.split(/[+\-*/]/);
    if (segs[segs.length - 1].includes(".")) return;
    if (expr === "" || ops.includes(last)) expr += "0";
  }

  expr += val;
  update();
}

document.querySelectorAll("button").forEach((b) => {
  b.addEventListener("click", () => {
    press(b.dataset.val || b.textContent);
  });
});

document.addEventListener("keydown", (e) => {
  const m = {
    Enter: "=",
    Escape: "AC",
    Backspace: "DEL",
    "*": "*",
    "/": "/",
    "+": "+",
    "-": "-",
    ".": ".",
  };
  const k = m[e.key] ?? (e.key >= "0" && e.key <= "9" ? e.key : null);
  if (k) {
    e.preventDefault();
    press(k);
  }
});
