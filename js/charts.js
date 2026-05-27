// ===== CHARTS — PROVAX × ESQUINA — RELATÓRIO FINAL =====

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
Chart.defaults.plugins.legend.labels.padding = 22;
Chart.defaults.animation.duration = 1400;
Chart.defaults.animation.easing = 'easeOutQuart';

// ── Paleta ──────────────────────────────────────────────
const C = {
  navy:  '#0D1B6E',
  blue:  '#1A3CFF',
  teal:  '#17A697',
  slate: '#4A6AFF',
};

const TIP = {
  backgroundColor: '#FFFFFF',
  titleColor: '#111111',
  bodyColor: '#555555',
  borderColor: 'rgba(0,0,0,0.09)',
  borderWidth: 1,
  cornerRadius: 10,
  padding: 14,
  titleFont: { weight: '700', size: 13 },
  bodyFont: { size: 12 },
  displayColors: false,
};

// ── Plugin: texto central nos doughnuts ─────────────────
const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const cfg = chart.config.options.plugins?.centerText;
    if (!cfg?.lines) return;
    const { ctx, chartArea: { left, right, top, bottom } } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    ctx.save();
    cfg.lines.forEach(line => {
      ctx.font = `${line.weight || '700'} ${line.size || 15}px Inter, sans-serif`;
      ctx.fillStyle = line.color || '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.text, cx, cy + (line.dy || 0));
    });
    ctx.restore();
  }
};

// ── Plugin: data labels nas barras ──────────────────────
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    if (!chart.config.options.plugins?.dataLabels?.enabled) return;
    const { ctx } = chart;
    const isH = chart.config.options.indexAxis === 'y';

    chart.data.datasets.forEach((ds, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;

      meta.data.forEach((el, idx) => {
        const val = ds.data[idx];
        if (!val) return;
        const label = val >= 1000
          ? (val >= 1000000
              ? (val / 1000000).toFixed(2).replace('.', ',') + 'M'
              : Math.round(val / 1000) + 'K')
          : val.toLocaleString('pt-BR');

        ctx.save();
        ctx.font = '600 11px Inter, sans-serif';
        ctx.fillStyle = '#444444';

        if (isH) {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, el.x + 7, el.y);
        } else {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(label, el.x, el.y - 5);
        }
        ctx.restore();
      });
    });
  }
};

Chart.register(centerTextPlugin, dataLabelsPlugin);

// ── CHART 1: Doughnut — Impressões por Conjunto ─────────
const ctxConj = document.getElementById('chartConjuntos');
if (ctxConj) {
  new Chart(ctxConj, {
    type: 'doughnut',
    data: {
      labels: ['Geo Primária', 'Geo Secundária', 'Personalizado'],
      datasets: [{
        data: [923996, 575296, 526954],
        backgroundColor: [C.navy, C.blue, C.teal],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: '500' }, color: '#444' }
        },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impressões (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '2,03M', size: 22, weight: '800', color: '#111111', dy: -12 },
            { text: 'impressões', size: 11, weight: '500', color: '#888888', dy: 12 },
          ]
        }
      }
    }
  });
}

// ── CHART 2: Horizontal Bar — Impressões por Anúncio ────
const ctxAds = document.getElementById('chartAnuncios');
if (ctxAds) {
  new Chart(ctxAds, {
    type: 'bar',
    data: {
      labels: ['DARK CARD', 'CARD FEED', 'DARK CARROSSEL'],
      datasets: [{
        data: [813870, 1066746, 145630],
        backgroundColor: [C.navy, C.blue, C.teal],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 60 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const cliques = [981, 1351, 307];
              const ctr     = ['0,121%', '0,127%', '0,211%'];
              const i = ctx.dataIndex;
              return [
                '  ' + ctx.parsed.x.toLocaleString('pt-BR') + ' impressões',
                '  Cliques: ' + cliques[i] + '  ·  CTR: ' + ctr[i],
              ];
            }
          }
        },
        dataLabels: { enabled: true }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          ticks: {
            font: { size: 11 }, color: '#AAAAAA', padding: 6,
            callback: v => v >= 1000 ? Math.round(v / 1000) + 'K' : v
          }
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 12, weight: '600' }, color: '#333333', padding: 6 }
        }
      }
    }
  });
}

// ── CHART 3: Bar — Impressões por Faixa Etária ──────────
const ctxAge = document.getElementById('chartIdade');
if (ctxAge) {
  new Chart(ctxAge, {
    type: 'bar',
    data: {
      labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
      datasets: [{
        data: [458980, 681097, 325884, 326350, 160654, 73257],
        backgroundColor: [C.navy, C.navy, C.blue, C.blue, C.teal, C.teal],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label + ' anos',
            label: ctx => {
              const pcts = ['22,7%', '33,6%', '16,1%', '16,1%', '7,9%', '3,6%'];
              return '  ' + ctx.parsed.y.toLocaleString('pt-BR') + ' impr. (' + pcts[ctx.dataIndex] + ')';
            }
          }
        },
        dataLabels: { enabled: true }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 12, weight: '600' }, color: '#444444', padding: 6 }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          ticks: {
            font: { size: 11 }, color: '#AAAAAA', padding: 6,
            callback: v => v >= 1000 ? Math.round(v / 1000) + 'K' : v
          }
        }
      }
    }
  });
}

// ── CHART 4: Doughnut — Gênero ──────────────────────────
const ctxGen = document.getElementById('chartGenero');
if (ctxGen) {
  new Chart(ctxGen, {
    type: 'doughnut',
    data: {
      labels: ['Feminino', 'Masculino'],
      datasets: [{
        data: [1172902, 849414],
        backgroundColor: [C.navy, C.teal],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12, weight: '500' }, color: '#444' }
        },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const total = 2022316; // feminino + masculino (excl. unknown)
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impr. (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '58,0%', size: 22, weight: '800', color: '#111111', dy: -12 },
            { text: 'feminino', size: 11, weight: '500', color: '#888888', dy: 12 },
          ]
        }
      }
    }
  });
}
