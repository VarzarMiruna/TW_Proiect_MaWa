const fetchData = async () => {
    try {
      const response = await fetch('/statistics');
      const statistics = await response.json();
  
      const pieChartData = [];
      statistics.forEach(statistica => {
        const dataPoint = {
          an: statistica.an,
          total_inregistrari: statistica.total_inregistrari
        };
        pieChartData.push(dataPoint);
      });
  
      const labels = pieChartData.map(dataPoint => dataPoint.an);
      const values = pieChartData.map(dataPoint => dataPoint.total_inregistrari);
  
      const canvas = document.getElementById('pieChart');
      const ctx = canvas.getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)'
            ]
          }]
        },
      });
    } catch (error) {
      console.error('Eroare la obținerea datelor:', error);
    }
  };
  
  fetchData();
  