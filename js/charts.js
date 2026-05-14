// ===== CHARTS — PROVAX × ESQUINA =====

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
      labels: ['Geo Primária', 'Geo Secundária', 'Remarketing'],
      datasets: [{
        data: [513249, 527361, 309482],
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
            { text: '1,35M', size: 22, weight: '800', color: '#111111', dy: -12 },
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
      labels: ['CARD PROVAX', 'CARD FEED', 'CARROSSEL'],
      datasets: [{
        data: [676630, 638380, 35082],
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
      layout: { padding: { right: 54 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const cliques = [773, 678, 37];
              const ctr     = ['0,114%', '0,106%', '0,105%'];
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
        data: [457241, 479354, 216921, 114277, 56090, 26195],
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
              const pcts = ['33,9%', '35,5%', '16,1%', '8,5%', '4,2%', '1,9%'];
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
        data: [787307, 559902],
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
              const total = 1347209;
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impr. (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '58,3%', size: 22, weight: '800', color: '#111111', dy: -12 },
            { text: 'feminino', size: 11, weight: '500', color: '#888888', dy: 12 },
          ]
        }
      }
    }
  });
}

// ── Animações de entrada ─────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function() {
    var fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = '67.5%';
  }, 400);

  setTimeout(function() {
    document.querySelectorAll('.cb-fill').forEach(function(el) {
      var w = el.getAttribute('data-width');
      if (w) el.style.width = w;
    });
  }, 600);
});
