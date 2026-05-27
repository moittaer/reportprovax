// ===== CHARTS — PROVAX SLIDES 16:9 =====

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.animation.duration = 1200;
Chart.defaults.animation.easing = 'easeOutQuart';

const SC = {
  blue:    '#1A3CFF',
  purple:  '#7B2FBE',
  navy:    '#0D1B6E',
  teal:    '#17A697',
  green:   '#00994D',
  orange:  '#E65100',
};

const STIP = {
  backgroundColor: '#FFFFFF',
  titleColor: '#111111',
  bodyColor: '#555555',
  borderColor: 'rgba(0,0,0,0.09)',
  borderWidth: 1,
  cornerRadius: 8,
  padding: 12,
  titleFont: { weight: '700', size: 12 },
  bodyFont: { size: 11 },
  displayColors: false,
};

// ── Plugin: texto central doughnuts ──────────────────────
const slideCenterText = {
  id: 'slideCenterText',
  afterDraw(chart) {
    const cfg = chart.config.options.plugins?.centerText;
    if (!cfg?.lines) return;
    const { ctx, chartArea: { left, right, top, bottom } } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    ctx.save();
    cfg.lines.forEach(line => {
      ctx.font = `${line.weight || '700'} ${line.size || 14}px Inter, sans-serif`;
      ctx.fillStyle = line.color || '#111111';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(line.text, cx, cy + (line.dy || 0));
    });
    ctx.restore();
  }
};
Chart.register(slideCenterText);

// ── CHART: Bar — Faixa Etária ────────────────────────────
const ctxAge = document.getElementById('chartSlideIdade');
if (ctxAge) {
  new Chart(ctxAge, {
    type: 'bar',
    data: {
      labels: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'],
      datasets: [{
        data: [458980, 681097, 325884, 326350, 160654, 73257],
        backgroundColor: [SC.navy, SC.navy, SC.blue, SC.blue, SC.teal, SC.teal],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 18 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          ...STIP,
          callbacks: {
            title: ctx => ctx[0].label + ' anos',
            label: ctx => {
              const pcts = ['22,7%','33,6%','16,1%','16,1%','7,9%','3,6%'];
              return '  ' + ctx.parsed.y.toLocaleString('pt-BR') + ' impr. (' + pcts[ctx.dataIndex] + ')';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 11, weight: '600' }, color: '#444' }
        },
        y: {
          grid: { color: 'rgba(0,0,0,0.04)', drawTicks: false },
          border: { display: false },
          ticks: {
            font: { size: 10 }, color: '#AAA', padding: 4,
            callback: v => v >= 1000 ? Math.round(v/1000)+'K' : v
          }
        }
      }
    }
  });
}

// ── CHART: Doughnut — Gênero ─────────────────────────────
const ctxGen = document.getElementById('chartSlideGenero');
if (ctxGen) {
  new Chart(ctxGen, {
    type: 'doughnut',
    data: {
      labels: ['Feminino', 'Masculino'],
      datasets: [{
        data: [1172902, 849414],
        backgroundColor: [SC.navy, SC.teal],
        borderColor: '#F0F3FA',
        borderWidth: 4,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11, weight: '500' }, color: '#444', padding: 16 }
        },
        tooltip: {
          ...STIP,
          callbacks: {
            title: ctx => ctx[0].label,
            label: ctx => {
              const total = 2022316;
              const pct = ((ctx.parsed / total) * 100).toFixed(1);
              return '  ' + ctx.parsed.toLocaleString('pt-BR') + ' impr. (' + pct + '%)';
            }
          }
        },
        centerText: {
          lines: [
            { text: '58,0%', size: 18, weight: '800', color: '#111111', dy: -10 },
            { text: 'feminino', size: 10, weight: '500', color: '#888', dy: 10 },
          ]
        }
      }
    }
  });
}
