let mode = "quadratic";
const form = document.getElementById('calcForm');
const inputArea = document.getElementById('inputArea');
const output = document.getElementById('output');
const ctx = document.getElementById('chart').getContext('2d');
const modeTitle = document.getElementById('modeTitle');
const chartContainer = document.getElementById('chart-container');
let chart;

// Add a canvas for Fibonacci spiral
let fibCanvas = null;

function initChart() {
    if (chart) chart.destroy();
    
    const container = document.getElementById('chart-container');
    ctx.canvas.width = container.offsetWidth;
    ctx.canvas.height = container.offsetHeight;
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Function',
                borderColor: '#007bff',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                tension: 0.1
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'center',
                    title: { display: true, text: 'x-axis' },
                    grid: {
                        color: ctx => ctx.tick.value === 0 ? 'rgba(0, 217, 241, 0.8)' : 'rgba(0, 217, 241, 0.8)'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'center',
                    title: { display: true, text: 'y-axis' },
                    grid: {
                        color: ctx => ctx.tick.value === 0 ? 'rgba(0, 217, 241, 0.8)' : 'rgba(0, 217, 241, 0.8)'
                    }
                }
            },
            plugins: {
                zoom: {
                    pan: { enabled: true, mode: 'xy' },
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy'
                    }
                }
            }
        }
    });
    
    
    const hammer = new Hammer(chart.canvas);
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    
    let lastPanX = 0, lastPanY = 0;
    hammer.on('panstart', () => { lastPanX = 0; lastPanY = 0; });
    hammer.on('pan', (e) => {
        const deltaX = e.deltaX - lastPanX;
        const deltaY = e.deltaY - lastPanY;
        chart.pan({
            x: -deltaX / chart.scales.x.pixelsPerUnit,
            y: deltaY / chart.scales.y.pixelsPerUnit
        });
        lastPanX = e.deltaX;
        lastPanY = e.deltaY;
        chart.update('none');
    });
}

function calculateVertex(a, b, c) {
    const vertexX = -b / (2 * a);
    return { x: vertexX, y: a * vertexX * vertexX + b * vertexX + c };
}

function createFibFlexRow() {
    // Only for Fibonacci mode: create a flex row for input and spiral
    let flexRow = document.getElementById('fib-flex-row');
    if (!flexRow) {
        flexRow = document.createElement('div');
        flexRow.id = 'fib-flex-row';
        flexRow.className = 'flex flex-row gap-8 items-center justify-center mb-4';
        inputArea.parentNode.insertBefore(flexRow, inputArea);
    }
    // Move inputArea into flexRow
    flexRow.appendChild(inputArea);
    // Add spiral canvas if not present
    if (!fibCanvas) {
        fibCanvas = document.createElement('canvas');
        fibCanvas.id = 'fib-spiral';
        fibCanvas.width = 220;
        fibCanvas.height = 220;
        fibCanvas.className = 'bg-white rounded-xl shadow-lg border border-blue-100';
    }
    if (!flexRow.contains(fibCanvas)) {
        flexRow.appendChild(fibCanvas);
    }
}

function removeFibFlexRow() {
    let flexRow = document.getElementById('fib-flex-row');
    if (flexRow) {
        if (inputArea && flexRow.contains(inputArea)) {
            flexRow.parentNode.insertBefore(inputArea, flexRow);
        }
        flexRow.remove();
    }
    removeFibCanvas();
}

function drawFibonacciSpiral(n) {
    createFibFlexRow();
    const ctx = fibCanvas.getContext('2d');
    ctx.clearRect(0, 0, fibCanvas.width, fibCanvas.height);
    // Draw spiral
    let x = 110, y = 110, angle = 0;
    let fib = [0, 1];
    for (let i = 2; i < n; i++) fib.push(fib[i-1] + fib[i-2]);
    let scale = 18 - Math.max(0, n-8)*1.5;
    for (let i = 1; i < n; i++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.arc(0, 0, fib[i]*scale, Math.PI/2, Math.PI, false);
        ctx.strokeStyle = `hsl(${i*40}, 70%, 50%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
        // Draw box
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.strokeStyle = '#bae6fd';
        ctx.strokeRect(0, 0, fib[i]*scale, fib[i]*scale);
        ctx.restore();
        // Move to next
        switch (i % 4) {
            case 1: x += fib[i]*scale; break;
            case 2: y += fib[i]*scale; break;
            case 3: x -= fib[i]*scale; break;
            case 0: y -= fib[i]*scale; break;
        }
        angle += Math.PI/2;
    }
    // Draw numbers
    x = 110; y = 110; angle = 0;
    for (let i = 1; i < n; i++) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.font = 'bold 14px Segoe UI, Arial';
        ctx.fillStyle = '#2563eb';
        ctx.fillText(fib[i], 10, 20);
        ctx.restore();
        switch (i % 4) {
            case 1: x += fib[i]*scale; break;
            case 2: y += fib[i]*scale; break;
            case 3: x -= fib[i]*scale; break;
            case 0: y -= fib[i]*scale; break;
        }
        angle += Math.PI/2;
    }
}

function removeFibCanvas() {
    if (fibCanvas && fibCanvas.parentNode) {
        fibCanvas.parentNode.removeChild(fibCanvas);
        fibCanvas = null;
    }
}

function setMode(m) {
    mode = m;
    output.textContent = "";
    if (m === "quadratic") {
        chartContainer.classList.remove('hidden');
        removeFibFlexRow();
        if (!chart) initChart();
        inputArea.innerHTML = `
            <input name="a" placeholder="a" value="1">
            <input name="b" placeholder="b" value="0">
            <input name="c" placeholder="c" value="0">
        `;
    } else if (m === "fibonacci") {
        chartContainer.classList.add('hidden');
        inputArea.innerHTML = `<input name="n" placeholder="Enter n" value="10">`;
        createFibFlexRow();
        drawFibonacciSpiral(10); // default
    } else {
        chartContainer.classList.add('hidden');
        removeFibFlexRow();
        inputArea.innerHTML = `<input name="n" placeholder="Enter n" value="10">`;
    }
    modeTitle.textContent = `${m.charAt(0).toUpperCase() + m.slice(1)} `;
}

inputArea.addEventListener('input', (e) => {
    if (mode === 'fibonacci') {
        const n = parseInt(e.target.value) || 1;
        drawFibonacciSpiral(Math.max(2, Math.min(n, 12)));
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const params = new URLSearchParams();
    if (mode === "quadratic") {
        params.append('a', formData.get('a'));
        params.append('b', formData.get('b'));
        params.append('c', formData.get('c'));
    } else {
        params.append('n', formData.get('n'));
    }
    try {
        const response = await fetch(`/calculate?mode=${mode}&${params.toString()}`);
        const data = await response.json();
        if (mode === "quadratic") {
            const a = parseFloat(formData.get('a'));
            const b = parseFloat(formData.get('b'));
            const c = parseFloat(formData.get('c'));
            const vertex = calculateVertex(a, b, c);
            const datasets = [{
                label: `y = ${a}x² + ${b}x + ${c}`,
                borderColor: '#007bff',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                data: data.x.map((x, i) => ({x, y: data.y[i]}))
            }, {
                label: 'Vertex',
                backgroundColor: '#ff0000',
                borderColor: '#ff0000',
                pointRadius: 8,
                pointHoverRadius: 10,
                data: [vertex],
                pointStyle: 'circle'
            }];
            if (data.roots.includes("x₁")) {
                const rootsText = data.roots.match(/x₁ = ([\d.-]+), x₂ = ([\d.-]+)/);
                if (rootsText) {
                    const root1 = parseFloat(rootsText[1]);
                    const root2 = parseFloat(rootsText[2]);
                    datasets.push({
                        label: 'Roots',
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        data: [
                            {x: root1, y: 0},
                            {x: root2, y: 0}
                        ],
                        pointStyle: 'rectRot'
                    });
                }
            } else if (data.roots.includes("x =")) {
                const rootText = data.roots.match(/x = ([\d.-]+)/);
                if (rootText) {
                    const root = parseFloat(rootText[1]);
                    datasets.push({
                        label: 'Root',
                        backgroundColor: '#28a745',
                        borderColor: '#28a745',
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        data: [{x: root, y: 0}],
                        pointStyle: 'rectRot'
                    });
                }
            }
            chart.data.datasets = datasets;
            chart.update();
            // Show roots and vertex clearly
            output.innerHTML = `<b>Roots:</b> ${data.roots}<br><b>Vertex:</b> (${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`;
        } else if (mode === 'fibonacci') {
            const n = parseInt(formData.get('n')) || 10;
            drawFibonacciSpiral(Math.max(2, Math.min(n, 12)));
            // Parse explanation for step-by-step
            let explanation = data.explanation || '';
            let [seqLine, ...explanationLines] = explanation.split(/\n|<br>/);
            let stepsHtml = '';
            if (explanationLines.length > 0) {
                stepsHtml = `<div class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 shadow-sm">
                    <div class="font-semibold mb-2 text-blue-700">Step-by-step Explanation:</div>
                    <ul class="list-disc pl-6">
                        <li>Start with 0 and 1.</li>
                        <li>Each next term is the sum of the two preceding terms.</li>
                        <li>Continue until you have ${n} terms.</li>
                    </ul>
                    <div class="mt-2 text-blue-800">${explanationLines.join('<br>')}</div>
                </div>`;
            }
            output.innerHTML = `<b>Fibonacci Sequence:</b><br>${seqLine}<br>${stepsHtml}`;
        } else {
            output.textContent = data.explanation;
        }
    } catch (error) {
        output.textContent = `Error: ${error.message}`;
    }
});


setMode('quadratic');