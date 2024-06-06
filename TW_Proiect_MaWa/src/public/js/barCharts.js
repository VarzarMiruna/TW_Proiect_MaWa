const chartSelect = document.getElementById("chart-select");

chartSelect.addEventListener("change", function() {
  const selectedOption = chartSelect.options[chartSelect.selectedIndex];
  const selectedURL = selectedOption.value;
  window.location.href = selectedURL;
});
