const chartSelect1 = document.getElementById("chart-select");

chartSelect1.addEventListener("change", function() {
  const selectedOption1 = chartSelect1.options[chartSelect1.selectedIndex];
  const selectedURL1 = selectedOption1.value;
  window.location.href = selectedURL1;
});
