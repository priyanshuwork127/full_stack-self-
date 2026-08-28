let count=10;
function updatecount(){
    document.getElementById("counter").innerHTML=count;
}
function increament(){
    count++;
    updatecount();
}
function decreament(){
    count--;
    updatecount();
}
function reset(){
    count=0;
    updatecount();
}
function saveCount() {
  localStorage.setItem("count", count);
}
function loadCount() {
  let saved = localStorage.getItem("count");
  if (saved !== null) {
    count = Number(saved);
  }
  updateCount();
}